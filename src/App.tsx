/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { ModeSelector } from "./components/ModeSelector";
import { SmartSearchBar } from "./components/SmartSearchBar";
import { MatterOverview } from "./components/MatterOverview";
import { ResearchOutput } from "./components/ResearchOutput";
import { DocumentModal } from "./components/DocumentModal";
import { CourtHierarchyModal } from "./components/CourtHierarchyModal";
import { SafliiGuideModal } from "./components/SafliiGuideModal";
import {
  ResearchMode,
  AudienceMode,
  ResearchResult,
  LegalMatter,
} from "./types";
import {
  Scale,
  Sparkles,
  ShieldCheck,
  Search,
  ExternalLink,
  BookOpen,
  ArrowRight,
  AlertCircle,
  FileText,
  Clock,
  Trash2,
} from "lucide-react";
import { RESEARCH_MODES } from "./data/sampleQueries";

const DEFAULT_MATTER: LegalMatter = {
  id: "matter-default",
  title: "Commercial Lease & Urgent Spoliation Dispute",
  clientRef: "MAT-2026/04",
  jurisdiction: "South Africa (Gauteng Division, Johannesburg)",
  areaOfLaw: "Property Law / Contract / Spoliation",
  facts: "Client runs a retail boutique in Sandton. The commercial landlord locked out the client and padlocked the premises over disputed utility charges, without a court order.",
  issuesIdentified: [
    "Does the landlord's unilateral lockout constitute spoliation under the mandament van spolie?",
    "What are the requirements for an urgent spoliation interdict under High Court Rule 6(12)?",
    "Can a landlord rely on contractual re-entry clauses without judicial process?",
  ],
  keyAuthorities: [
    "Nienaber v Stuckey 1946 AD 1049",
    "FirstRand Bank Ltd v Scholtz NO 2008 (2) SA 403 (SCA)",
  ],
  outstandingResearch: [
    "Verify whether recent 2022-2024 High Court judgments allowed spoliation for electronic access card deactivations.",
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function App() {
  const [audienceMode, setAudienceMode] = useState<AudienceMode>("lawyer");
  const [currentMode, setCurrentMode] = useState<ResearchMode>("find_case");
  const [activeMatter, setActiveMatter] = useState<LegalMatter>(() => {
    const saved = localStorage.getItem("lexsa_active_matter");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_MATTER;
  });

  const [searchHistory, setSearchHistory] = useState<ResearchResult[]>(() => {
    const saved = localStorage.getItem("lexsa_search_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [activeResult, setActiveResult] = useState<ResearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("Searching SAFLII database...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<{ query: string; mode: ResearchMode; docText?: string } | null>(null);

  // Modals state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isHierarchyModalOpen, setIsHierarchyModalOpen] = useState(false);
  const [isSafliiGuideOpen, setIsSafliiGuideOpen] = useState(false);
  const [attachedDocText, setAttachedDocText] = useState<string>("");

  const activeAbortController = useRef<AbortController | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("lexsa_active_matter", JSON.stringify(activeMatter));
  }, [activeMatter]);

  useEffect(() => {
    localStorage.setItem("lexsa_search_history", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleModeSelect = (mode: ResearchMode, defaultPrompt?: string) => {
    setCurrentMode(mode);
    if (defaultPrompt) {
      handleExecuteResearch(defaultPrompt, mode);
    }
  };

  const handleExecuteResearch = async (
    query: string,
    mode: ResearchMode,
    docText?: string
  ) => {
    // Section 21: Prevent duplicate submissions
    if (isLoading) {
      console.warn("Research request already in progress; duplicate submission blocked.");
      return;
    }

    // Abort previous in-flight request if any
    if (activeAbortController.current) {
      activeAbortController.current.abort();
    }
    const abortController = new AbortController();
    activeAbortController.current = abortController;

    setLastRequest({ query, mode, docText });
    setIsLoading(true);
    setErrorMsg(null);
    setCurrentMode(mode);

    const steps = [
      "Identifying South African legal issues & statutory scope...",
      "Retrieving verified judgments from SAFLII.org...",
      "Weighing Constitutional Court & Supreme Court of Appeal precedent...",
      "Synthesizing legal principles & drafting IRAC analysis...",
    ];

    let stepIndex = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setLoadingStep(steps[stepIndex]);
    }, 2000);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortController.signal,
        body: JSON.stringify({
          query,
          mode,
          audienceMode,
          matterContext: activeMatter,
          documentText: docText || attachedDocText,
          jurisdiction: activeMatter?.jurisdiction || "South Africa",
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Clean user-friendly message, never raw JSON or 503 stack trace
        throw new Error(
          errorData.message ||
          errorData.error ||
          "The legal research service is currently busy. Please try again or query SAFLII directly."
        );
      }

      const data = await response.json();
      const isBusy = Boolean(data.serviceBusy);

      const newResult: ResearchResult = {
        id: `res-${Date.now()}`,
        query,
        mode,
        audienceMode,
        content: data.content || "",
        sources: data.sources || [],
        directSafliiSearchUrl: data.directSafliiSearchUrl,
        timestamp: data.timestamp || new Date().toISOString(),
        matterTitle: activeMatter?.title,
        authorities: data.authorities || [],
        isServiceBusy: isBusy,
        busyMessage: data.busyMessage,
        searchTerms: data.searchTerms,
        legalConcepts: data.legalConcepts,
      };

      setActiveResult(newResult);

      if (!isBusy) {
        setSearchHistory((prev) => [newResult, ...prev.slice(0, 19)]);

        // Auto-extract any new issue for the matter if analyzing
        if (mode === "analyse_matter" && !activeMatter.issuesIdentified.includes(query)) {
          setActiveMatter((prev) => ({
            ...prev,
            issuesIdentified: [query, ...prev.issuesIdentified.slice(0, 7)],
            updatedAt: new Date().toISOString(),
          }));
        }
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      if (err.name === "AbortError") {
        console.log("Research request aborted by user action.");
        return;
      }
      console.error("Research execution error:", err);
      // Clean, professional user-facing error message adhering to Section 5
      const raw = (err.message || "").toLowerCase();
      if (raw.includes("503") || raw.includes("high demand") || raw.includes("unavailable") || raw.includes("{")) {
        setErrorMsg(
          "The legal research model is currently experiencing high demand. Select 'Try Analysis Again' or query SAFLII directly."
        );
      } else {
        setErrorMsg(err.message || "An error occurred while connecting to the legal research service.");
      }
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
      activeAbortController.current = null;
    }
  };

  const handleNewMatter = () => {
    const newMatter: LegalMatter = {
      id: `matter-${Date.now()}`,
      title: "New Legal Matter",
      jurisdiction: "South Africa",
      areaOfLaw: "General Law",
      facts: "",
      issuesIdentified: [],
      keyAuthorities: [],
      outstandingResearch: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setActiveMatter(newMatter);
    setActiveResult(null);
    setAttachedDocText("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Professional Header */}
      <Header
        audienceMode={audienceMode}
        onAudienceModeChange={setAudienceMode}
        onOpenHierarchy={() => setIsHierarchyModalOpen(true)}
        onOpenSafliiGuide={() => setIsSafliiGuideOpen(true)}
        onOpenDocModal={() => setIsDocModalOpen(true)}
        onNewMatter={handleNewMatter}
        hasActiveMatter={!!activeMatter.title}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* First Message & Welcome Banner (Sections 5 & 34) */}
        {!activeResult && !isLoading && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

            <div className="max-w-3xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Southern African Legal Information Institute (SAFLII) Primary Source</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight">
                Welcome to <span className="text-amber-400">LexSA</span> Legal Research
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                Research South African case law, legislation and legal principles using SAFLII as the primary case-law source. Designed specifically for advocates, attorneys, candidate attorneys, paralegals, and legal researchers.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Live SAFLII Retrieval Enabled
                </span>
                <span>•</span>
                <span>Constitutional Court (ZACC)</span>
                <span>•</span>
                <span>Supreme Court of Appeal (ZASCA)</span>
                <span>•</span>
                <span>High Courts & Specialist Tribunals</span>
              </div>
            </div>
          </div>
        )}

        {/* Matter Overview Workspace (Section 30) */}
        <MatterOverview
          matter={activeMatter}
          onUpdateMatter={setActiveMatter}
          onClearMatter={handleNewMatter}
        />

        {/* 10 Primary Starting Interface Modes (Section 5 & 34) */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5">
          <ModeSelector
            currentMode={currentMode}
            onSelectMode={handleModeSelect}
          />
        </div>

        {/* Smart Search Bar (Section 6) */}
        <SmartSearchBar
          currentMode={currentMode}
          onSearch={(q, m) => handleExecuteResearch(q, m)}
          isLoading={isLoading}
          onOpenDocModal={() => setIsDocModalOpen(true)}
          hasDocumentAttached={!!attachedDocText}
        />

        {/* Loading State with Stage Feedback */}
        {isLoading && (
          <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-8 sm:p-12 text-center shadow-xl space-y-4 animate-pulse">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Scale className="w-6 h-6 text-amber-400 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-serif font-semibold text-slate-100">
                LexSA South African Legal Engine Active
              </h3>
              <p className="text-sm text-amber-400 font-mono mt-1">
                {loadingStep}
              </p>
              <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                Verifying genuine citations, checking court hierarchy weights, and grounding in saflii.org records...
              </p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-xs text-rose-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Research Error</span>
              <p>{errorMsg}</p>
              <p className="text-slate-400 pt-1">
                Tip: You can query SAFLII directly using the &ldquo;Query SAFLII Directly&rdquo; button, or select &ldquo;Try Analysis Again&rdquo;.
              </p>
            </div>
          </div>
        )}

        {/* Research Output (Active Result) */}
        {activeResult && !isLoading && (
          <ResearchOutput
            result={activeResult}
            isLoading={isLoading}
            onRetry={() => {
              if (lastRequest) {
                handleExecuteResearch(lastRequest.query, lastRequest.mode, lastRequest.docText);
              } else if (activeResult?.query) {
                handleExecuteResearch(activeResult.query, activeResult.mode);
              }
            }}
            onReturnToMatter={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onFollowUp={(prompt, mode) => handleExecuteResearch(prompt, mode)}
            onAddKeyAuthority={(auth) => {
              if (!activeMatter.keyAuthorities.includes(auth)) {
                setActiveMatter((prev) => ({
                  ...prev,
                  keyAuthorities: [...prev.keyAuthorities, auth],
                }));
              }
            }}
          />
        )}

        {/* Recent Research History for Current Matter */}
        {searchHistory.length > 1 && (
          <div className="bg-slate-900/50 border border-slate-800/70 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Matter Research History ({searchHistory.length})</span>
              </div>
              <button
                onClick={() => setSearchHistory([])}
                className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center gap-1"
                title="Clear history"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {searchHistory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveResult(item)}
                  className={`text-left p-3 rounded-xl border transition-all text-xs space-y-1 ${
                    activeResult?.id === item.id
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
                      : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-amber-400 capitalize">{item.mode.replace("_", " ")}</span>
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="font-medium text-slate-200 truncate">{item.query}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-400">LexSA</span>
            <span>•</span>
            <span>South African Legal Research Assistant</span>
            <span>•</span>
            <span className="text-amber-500/80 font-medium">SAFLII Integration Engine</span>
          </div>
          <div className="text-slate-500">
            Primary source: <a href="https://www.saflii.org" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">SAFLII.org</a> (Southern African Legal Information Institute)
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onAnalyzeDocument={(text) => {
          setAttachedDocText(text);
          setIsDocModalOpen(false);
          handleExecuteResearch("Analyze attached legal document and extract issues and SAFLII authorities", "document_analysis", text);
        }}
      />

      <CourtHierarchyModal
        isOpen={isHierarchyModalOpen}
        onClose={() => setIsHierarchyModalOpen(false)}
      />

      <SafliiGuideModal
        isOpen={isSafliiGuideOpen}
        onClose={() => setIsSafliiGuideOpen(false)}
      />
    </div>
  );
}
