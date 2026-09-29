/**
 * LexSA Resilient Gemini Legal Analysis Service
 * 
 * Implements:
 * - Model Strategy:
 *     Primary: gemini-3.8-flash
 *     First Fallback: gemini-3.6-flash
 *     Second Fallback: gemini-3.5-flash
 *     Safety Fallbacks: gemini-3.1-flash-lite, gemini-flash-latest
 * - Controlled Exponential Backoff with Jitter
 * - Fail-fast timeouts on 503/stalling models (5s) so user doesn't wait; generous timeout on working models (28s)
 * - Single well-structured prompt combining user query + verified SAFLII authorities
 * - Never returns raw JSON or stack traces to the user
 */

import { GoogleGenAI } from "@google/genai";
import { SafliiSearchResult } from "./safliiEngine";

export interface LegalAnalysisOptions {
  query: string;
  mode: string;
  audienceMode: "lawyer" | "public";
  matterContext?: any;
  documentText?: string;
  jurisdiction?: string;
  safliiData: SafliiSearchResult;
}

export interface AnalysisResponse {
  success: boolean;
  content: string;
  serviceBusy?: boolean;
  modelUsed?: string;
  errorDetail?: string;
}

const PRIMARY_MODEL = "gemini-3.8-flash";
const FALLBACK_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];

function isTransientError(err: any): { isTransient: boolean; statusCode?: number } {
  if (!err) return { isTransient: false };
  const message = (err.message || "").toLowerCase();
  const status = err.status || err.statusCode || (err.error && err.error.code);

  if (status === 503 || message.includes("503") || message.includes("high demand") || message.includes("unavailable")) {
    return { isTransient: true, statusCode: 503 };
  }
  if (status === 429 || message.includes("429") || message.includes("quota") || message.includes("resource_exhausted")) {
    return { isTransient: true, statusCode: 429 };
  }
  if (
    status === 500 ||
    status === 502 ||
    status === 504 ||
    message.includes("deadline") ||
    message.includes("timeout") ||
    message.includes("fetch failed")
  ) {
    return { isTransient: true, statusCode: status || 500 };
  }

  // Explicit non-retryable errors
  if (status === 400 || status === 401 || status === 403 || status === 404) {
    return { isTransient: false, statusCode: status };
  }

  return { isTransient: false, statusCode: status };
}

function sleepWithJitter(baseMs: number): Promise<void> {
  const jitter = Math.floor(Math.random() * 200);
  return new Promise((resolve) => setTimeout(resolve, baseMs + jitter));
}

export async function executeLegalAnalysis(
  ai: GoogleGenAI,
  options: LegalAnalysisOptions
): Promise<AnalysisResponse> {
  const { query, mode, audienceMode, matterContext, documentText, safliiData } = options;

  const authoritiesText = safliiData.authorities
    .map(
      (a, i) =>
        `[${i + 1}] ${a.caseName} (${a.citation})\n  Court: ${a.court} (${a.year}) | Precedential Weight: ${a.hierarchyWeight}\n  Ratio / Principles: ${a.legalPrinciples}\n  SAFLII Link: ${a.safliiUrl}`
    )
    .join("\n\n");

  const legalConceptsText = safliiData.legalConcepts.join("; ");
  const searchTermsText = safliiData.searchTerms.join(", ");

  const audiencePrompt =
    audienceMode === "lawyer"
      ? "AUDIENCE: Legal Professional (Advocate, Attorney, Candidate Attorney). Use rigorous South African legal terminology, address onus, evidentiary requirements, causa, jurisdiction, prescription, and court rules."
      : "AUDIENCE: Public User. Explain South African legal concepts clearly in plain English, avoid dense Latin jargon where possible, and clearly remind the user to consult an admitted attorney for formal legal advice.";

  const systemInstruction = `You are LexSA, a premier South African Legal Research Assistant designed for legal professionals and researchers.

PRIMARY DIRECTIVE:
Analyse the user's legal question using the supplied verified SAFLII legal authorities and statutory principles.
SAFLII (https://www.saflii.org/) is the primary case-law authority.

ANTI-HALLUCINATION & CITATION INTEGRITY:
- Do not invent cases, citations, legislation, quotations or paragraph numbers.
- Separate verified law from your legal analysis.
- When citing the supplied cases, provide their exact verified citations and SAFLII links.
- If the supplied sources do not establish something or an issue is unresolved, state clearly: "I could not verify this from the available legal sources."
- Do not guarantee a definitive court outcome. Provide objective, high-calibre research while leaving final professional judgment to the practitioner.

RESPONSE STRUCTURE (Section 12 Mandate):
## 1. Matter Overview & Jurisdictional Scope
## 2. Key Legal Issues
## 3. Applicable South African Legislation (Statutes, Regulations, Sections)
## 4. Primary SAFLII Case Authorities (Weighed by Court Hierarchy: Constitutional Court > SCA > High Courts)
## 5. Core Legal Principles & Ratio Decidendi
## 6. Application to the User's Facts (IRAC Analysis)
## 7. Arguments Supporting the Position
## 8. Counterarguments & Opposing Party Defences
## 9. Evidentiary Onus, Risks & Missing Facts
## 10. Practical Legal & Procedural Considerations (Rules of Court / Urgency / Pleadings)
## 11. Research Conclusion
## 12. Verified Sources & Direct SAFLII Links`;

  const userPrompt = `USER LEGAL QUESTION / MATTER:
"${query || "Analyze provided legal document"}"

${audiencePrompt}
RESEARCH MODE: ${mode.toUpperCase()}
IDENTIFIED LEGAL CONCEPTS: ${legalConceptsText}
RESEARCH TERMS USED: ${searchTermsText}

VERIFIED SAFLII AUTHORITIES RETRIEVED:
${authoritiesText}

${matterContext ? `MATTER CONTEXT:\n- Title: ${matterContext.title || "Matter"}\n- Facts: ${matterContext.facts || "None"}\n- Ref: ${matterContext.clientRef || ""}` : ""}

${documentText ? `ATTACHED DOCUMENT EXTRACT FOR ANALYSIS:\n"""\n${documentText.slice(0, 15000)}\n"""` : ""}

REMINDER: Integrate the verified authorities above into your analysis. Cite the exact SAFLII links. Distinguish between binding Constitutional Court/SCA decisions and persuasive High Court rulings.`;

  // Execution Plan:
  // Fast 5s timeout on 3.8 and 3.6 to detect 503 or socket stall immediately
  // 28s timeout on working 3.5 and 3.1-flash-lite
  const executionPlan = [
    { model: PRIMARY_MODEL, timeoutMs: 5000, delayBefore: 0, label: "Attempt 1 (Primary: 3.8-flash)" },
    { model: PRIMARY_MODEL, timeoutMs: 5000, delayBefore: 1000, label: "Attempt 2 (Retry: 3.8-flash)" },
    { model: FALLBACK_MODELS[0], timeoutMs: 5000, delayBefore: 800, label: "Attempt 3 (Fallback 1: 3.6-flash)" },
    { model: FALLBACK_MODELS[1], timeoutMs: 28000, delayBefore: 200, label: "Attempt 4 (Fallback 2: 3.5-flash)" },
    { model: FALLBACK_MODELS[2], timeoutMs: 28000, delayBefore: 200, label: "Attempt 5 (Safety: 3.1-flash-lite)" },
    { model: FALLBACK_MODELS[3], timeoutMs: 28000, delayBefore: 200, label: "Attempt 6 (Safety: flash-latest)" },
  ];

  console.log(`[LexSA] Starting legal analysis for mode="${mode}" | query="${query.slice(0, 50)}..."`);

  for (let i = 0; i < executionPlan.length; i++) {
    const step = executionPlan[i];
    if (step.delayBefore > 0) {
      console.log(`[LexSA] Waiting ${step.delayBefore}ms before ${step.label}...`);
      await sleepWithJitter(step.delayBefore);
    }

    try {
      console.log(`[LexSA] Executing ${step.label} with model="${step.model}"...`);
      const startTime = Date.now();

      const generatePromise = ai.models.generateContent({
        model: step.model,
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.25,
          maxOutputTokens: 2500,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${step.timeoutMs}ms`)), step.timeoutMs)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);
      const elapsed = Date.now() - startTime;
      const text = response.text?.trim();

      if (text && text.length > 50) {
        console.log(`[LexSA] Analysis succeeded with ${step.model} in ${elapsed}ms (length=${text.length})`);
        return {
          success: true,
          content: text,
          modelUsed: step.model,
        };
      }
    } catch (err: any) {
      const { isTransient, statusCode } = isTransientError(err);
      console.warn(
        `[LexSA] ${step.label} failed (status=${statusCode || "unknown"}, transient=${isTransient}):`,
        err?.message?.slice(0, 100)
      );

      if (!isTransient && statusCode && statusCode < 500 && statusCode !== 429) {
        console.error(`[LexSA] Permanent error encountered (${statusCode}). Aborting execution plan.`);
        return {
          success: false,
          content: "",
          serviceBusy: false,
          errorDetail: "The request could not be processed due to invalid parameters or authentication.",
        };
      }
    }
  }

  console.error("[LexSA] All model retry and fallback attempts exhausted.");
  return {
    success: false,
    content: "",
    serviceBusy: true,
    errorDetail: "All research models are currently experiencing unusually high demand.",
  };
}
