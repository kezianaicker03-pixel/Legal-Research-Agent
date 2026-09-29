import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { retrieveSafliiAuthorities } from "./server/safliiEngine";
import { executeLegalAnalysis } from "./server/geminiService";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy-initialize Gemini Client
function getAiClient(): GoogleGenAI {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is missing. Please configure your API key in the AI Studio Settings > Secrets panel."
    );
  }
  return new GoogleGenAI({
    apiKey: currentKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    platform: "LexSA Legal Research System",
  });
});

// Dedicated SAFLII direct retrieval endpoint (Section 6 & 7)
app.post("/api/saflii/retrieve", (req, res) => {
  try {
    const { query, documentText } = req.body;
    const safliiData = retrieveSafliiAuthorities(query || "", documentText);
    res.json({
      success: true,
      ...safliiData,
    });
  } catch (err: any) {
    console.error("[LexSA] Error in /api/saflii/retrieve:", err);
    res.status(500).json({
      error: "Failed to retrieve SAFLII case authorities.",
    });
  }
});

// Primary Legal Research endpoint: SAFLII retrieval + Resilient AI Analysis
app.post("/api/research", async (req, res) => {
  const requestStart = Date.now();
  try {
    const {
      query = "",
      mode = "find_case",
      audienceMode = "lawyer",
      matterContext,
      documentText,
      jurisdiction = "South Africa",
    } = req.body;

    if (!query.trim() && !documentText?.trim()) {
      return res.status(400).json({ error: "A research question or document text is required." });
    }

    console.log(`[LexSA] Incoming research request: mode=${mode}, query="${query.slice(0, 60)}"`);

    // STEP 1: Independent SAFLII Retrieval & Concept Identification (Section 6)
    // LexSA does NOT depend on Gemini simply to find SAFLII cases.
    const safliiData = retrieveSafliiAuthorities(query, documentText);
    console.log(
      `[LexSA] SAFLII retrieval complete: ${safliiData.authorities.length} authorities found, terms=[${safliiData.searchTerms.join(", ")}]`
    );

    // Check Gemini API initialization
    let ai: GoogleGenAI;
    try {
      ai = getAiClient();
    } catch (keyErr: any) {
      console.warn("[LexSA] Gemini client unavailable:", keyErr?.message);
      // Even if Gemini API key is missing or invalid, Section 7 requires preserving SAFLII authorities!
      return res.json({
        serviceBusy: true,
        title: "API Configuration Required",
        message: "GEMINI_API_KEY is not configured on the server. Verified SAFLII authorities have been retrieved and preserved below.",
        authorities: safliiData.authorities,
        sources: safliiData.authorities.map((a) => ({
          title: `${a.caseName} (${a.citation})`,
          uri: a.safliiUrl,
          isSaflii: true,
        })),
        directSafliiSearchUrl: safliiData.directSafliiUrl,
        searchTerms: safliiData.searchTerms,
        legalConcepts: safliiData.legalConcepts,
        timestamp: new Date().toISOString(),
        mode,
      });
    }

    // STEP 2: Execute Legal Analysis with Model Strategy & Exponential Backoff (Sections 2, 3, 4, 8)
    const analysis = await executeLegalAnalysis(ai, {
      query,
      mode,
      audienceMode,
      matterContext,
      documentText,
      jurisdiction,
      safliiData,
    });

    const elapsed = Date.now() - requestStart;

    // STEP 3: Return verified response or Section 7 preservation view
    if (analysis.success) {
      console.log(`[LexSA] Request completed successfully in ${elapsed}ms using ${analysis.modelUsed}`);
      return res.json({
        serviceBusy: false,
        content: analysis.content,
        sources: safliiData.authorities.map((a) => ({
          title: `${a.caseName} (${a.citation})`,
          uri: a.safliiUrl,
          isSaflii: true,
        })),
        authorities: safliiData.authorities,
        directSafliiSearchUrl: safliiData.directSafliiUrl,
        searchTerms: safliiData.searchTerms,
        legalConcepts: safliiData.legalConcepts,
        timestamp: new Date().toISOString(),
        mode,
      });
    }

    // If all retry and fallback attempts failed due to capacity (Section 5 & 7):
    console.warn(`[LexSA] All AI models busy. Returning preserved SAFLII authorities in ${elapsed}ms.`);
    return res.json({
      serviceBusy: true,
      title: "Research service temporarily busy",
      message: "LexSA could not complete the AI analysis because the research service is experiencing unusually high demand. Your question has been preserved.",
      content: "",
      authorities: safliiData.authorities,
      sources: safliiData.authorities.map((a) => ({
        title: `${a.caseName} (${a.citation})`,
        uri: a.safliiUrl,
        isSaflii: true,
      })),
      directSafliiSearchUrl: safliiData.directSafliiUrl,
      searchTerms: safliiData.searchTerms,
      legalConcepts: safliiData.legalConcepts,
      timestamp: new Date().toISOString(),
      mode,
    });
  } catch (err: any) {
    console.error("[LexSA] Unexpected server error in /api/research:", err);
    // Sanitize error: never return raw JSON or API stack traces to the user (Section 5)
    return res.status(500).json({
      error: "An unexpected error occurred while processing the research query. Your question has been preserved.",
    });
  }
});

// Start Express and Vite server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LexSA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
