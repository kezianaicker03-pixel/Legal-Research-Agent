import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  BookOpen,
  AlertTriangle,
  Scale,
  RefreshCw,
  FolderKanban,
  Clock,
  BookmarkPlus,
} from "lucide-react";
import { ResearchResult, ResearchMode } from "../types";

interface ResearchOutputProps {
  result: ResearchResult;
  onFollowUp: (prompt: string, mode: ResearchMode) => void;
  onAddKeyAuthority?: (authority: string) => void;
  onRetry?: () => void;
  onReturnToMatter?: () => void;
  isLoading?: boolean;
}

export const ResearchOutput: React.FC<ResearchOutputProps> = ({
  result,
  onFollowUp,
  onAddKeyAuthority,
  onRetry,
  onReturnToMatter,
  isLoading = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [savedAuthorities, setSavedAuthorities] = useState<Record<string, boolean>>({});

  const handleCopy = async () => {
    try {
      const textToCopy = result.content || result.query;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const content = result.content || `# LexSA Legal Research\n\n**Query:** ${result.query}\n\n## Preserved SAFLII Authorities\n` +
      (result.authorities?.map(a => `### ${a.caseName} (${a.citation})\n- Court: ${a.court} (${a.year})\n- SAFLII: ${a.safliiUrl}\n- Principles: ${a.legalPrinciples}\n`).join("\n") || "");
    const file = new Blob([content], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `LexSA-Research-${result.mode}-${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAuth = (caseCitation: string) => {
    if (onAddKeyAuthority) {
      onAddKeyAuthority(caseCitation);
      setSavedAuthorities(prev => ({ ...prev, [caseCitation]: true }));
    }
  };

  // Follow-up actions based on mode & Section 28
  const getFollowUpActions = () => {
    switch (result.mode) {
      case "find_case":
        return [
          { label: "Check Case Authority", mode: "check_authority" as ResearchMode, prompt: `Check whether the primary cases identified above are still good authority or if they were distinguished or overruled.` },
          { label: "Compare These Cases", mode: "compare_cases" as ResearchMode, prompt: `Compare the leading cases identified in this research in a structured table highlighting factual similarities, legal differences, and court hierarchy.` },
          { label: "Analyse Against Client Facts", mode: "analyse_matter" as ResearchMode, prompt: `Apply these identified case principles to my matter and evaluate strengths and weaknesses using the IRAC method.` },
          { label: "Create Research Memo", mode: "draft_memo" as ResearchMode, prompt: `Draft a formal legal research memorandum incorporating these authorities.` },
        ];
      case "analyse_matter":
        return [
          { label: "Build Opposing Arguments", mode: "build_arguments" as ResearchMode, prompt: `Develop the strongest counterarguments and defences the opposing party will raise against this position.` },
          { label: "Find More Similar Judgments", mode: "similar_cases" as ResearchMode, prompt: `Find additional factually analogous South African judgments on SAFLII to strengthen the precedent.` },
          { label: "Check Authority of Leading Case", mode: "check_authority" as ResearchMode, prompt: `Check the subsequent judicial treatment of the primary case relied on.` },
          { label: "Draft Formal Memo", mode: "draft_memo" as ResearchMode, prompt: `Draft a formal legal research memorandum for this matter ready for the client or senior partner.` },
        ];
      case "research_issue":
      case "research_legislation":
        return [
          { label: "Find Interpreting Cases", mode: "find_case" as ResearchMode, prompt: `Find the most recent Supreme Court of Appeal and Constitutional Court judgments interpreting this specific statutory provision.` },
          { label: "Build Arguments for Dispute", mode: "build_arguments" as ResearchMode, prompt: `Build persuasive legal arguments based on this interpretation.` },
          { label: "Draft Legal Opinion / Memo", mode: "draft_memo" as ResearchMode, prompt: `Generate a structured legal research memorandum detailing this statutory interpretation.` },
        ];
      case "compare_cases":
        return [
          { label: "Check Which Overruled Which", mode: "check_authority" as ResearchMode, prompt: `Investigate whether a higher court (SCA or Constitutional Court) subsequently resolved the tension between these judgments.` },
          { label: "Apply Preferred Case to Facts", mode: "analyse_matter" as ResearchMode, prompt: `Apply the more favourable case authority to our factual matrix and distinguish the adverse case.` },
          { label: "Draft Memo", mode: "draft_memo" as ResearchMode, prompt: `Draft a legal memo synthesizing the comparison.` },
        ];
      default:
        return [
          { label: "Find More Cases", mode: "find_case" as ResearchMode, prompt: `Find more relevant South African judgments on SAFLII dealing with this issue.` },
          { label: "Check Case Authority", mode: "check_authority" as ResearchMode, prompt: `Verify if the authorities cited above have been followed or criticised.` },
          { label: "Build Legal Arguments", mode: "build_arguments" as ResearchMode, prompt: `Develop full applicant and respondent arguments based on this research.` },
          { label: "Create Research Memo", mode: "draft_memo" as ResearchMode, prompt: `Draft a formal structured legal research memorandum based on these findings.` },
        ];
    }
  };

  const followUpActions = getFollowUpActions();

  // =========================================================================
  // SECTION 5 & SECTION 7: RESEARCH SERVICE TEMPORARILY BUSY (PRESERVED VIEW)
  // =========================================================================
  if (result.isServiceBusy) {
    return (
      <div className="bg-slate-900/95 border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl space-y-0">
        {/* Top Status Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-amber-200">
                Research service temporarily busy
              </h3>
              <p className="text-xs text-slate-400">
                AI analysis is temporarily unavailable, but your legal authorities have been retrieved and preserved.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
              Preserved at {new Date(result.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-7 space-y-6">
          {/* Friendly explanation mandated by Section 5 */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5">
            <p className="text-sm text-slate-200 leading-relaxed">
              LexSA could not complete the deep AI analysis because the research service is experiencing unusually high demand.
            </p>
            <p className="text-xs text-slate-400 mt-1.5">
              Your research question and verified SAFLII authorities have been safely preserved.
            </p>

            <div className="mt-3.5 pt-3.5 border-t border-slate-800/80">
              <div className="text-[11px] font-medium text-amber-400/90 uppercase tracking-wider mb-1">
                Your Preserved Question:
              </div>
              <div className="text-sm text-slate-100 font-serif italic bg-slate-900/90 px-3.5 py-2.5 rounded-lg border border-slate-800">
                &ldquo;{result.query}&rdquo;
              </div>
            </div>
          </div>

          {/* Action Buttons: [ Try Again ] [ Search SAFLII ] [ Return to Matter ] */}
          <div className="flex flex-wrap items-center gap-3">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span>{isLoading ? "Re-analysing..." : "Try Analysis Again"}</span>
              </button>
            )}

            {result.directSafliiSearchUrl && (
              <a
                href={result.directSafliiSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 hover:border-amber-400/50 font-medium text-xs sm:text-sm transition-all shadow-md"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Search SAFLII Directly</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400/70" />
              </a>
            )}

            {onReturnToMatter && (
              <button
                type="button"
                onClick={onReturnToMatter}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-xs sm:text-sm border border-slate-700 transition-all"
              >
                <FolderKanban className="w-4 h-4 text-slate-400" />
                <span>Return to Matter</span>
              </button>
            )}
          </div>

          {/* SECTION 7: Verified SAFLII Authorities Preserved */}
          {result.authorities && result.authorities.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-200">
                    Verified SAFLII Authorities Preserved ({result.authorities.length})
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Grounded in SAFLII Law Reports
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {result.authorities.map((auth, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm sm:text-base text-amber-300">
                            {auth.caseName}
                          </span>
                          <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {auth.citation}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                          <span className="text-slate-300 font-medium">{auth.court}</span>
                          <span>•</span>
                          <span>{auth.year}</span>
                          {auth.hierarchyWeight && (
                            <>
                              <span>•</span>
                              <span className="text-amber-400/90 font-medium">{auth.hierarchyWeight}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {onAddKeyAuthority && (
                          <button
                            type="button"
                            onClick={() => handleSaveAuth(`${auth.caseName} (${auth.citation})`)}
                            disabled={savedAuthorities[`${auth.caseName} (${auth.citation})`]}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-amber-500/40 transition-colors disabled:opacity-50"
                            title="Add to Matter Key Authorities"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                            <span>
                              {savedAuthorities[`${auth.caseName} (${auth.citation})`] ? "Saved" : "Save Authority"}
                            </span>
                          </button>
                        )}

                        <a
                          href={auth.safliiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1 text-xs rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors font-medium"
                          title="View judgment on SAFLII.org"
                        >
                          <span>Open on SAFLII</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {auth.legalPrinciples && (
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60 font-sans">
                        <span className="font-semibold text-amber-400">Ratio Decidendi / Principles: </span>
                        {auth.legalPrinciples}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // STANDARD VIEW: FULL COMPREHENSIVE LEGAL RESEARCH MEMORANDUM
  // =========================================================================
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Action Ribbon */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold text-slate-300">
            Legal Analysis Complete
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400 font-mono text-[11px]">
            {new Date(result.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {result.directSafliiSearchUrl && (
            <a
              href={result.directSafliiSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg transition-colors font-medium"
              title="Execute live query directly in SAFLII database"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Query SAFLII Directly</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            title="Copy markdown text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            title="Export research as markdown file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            title="Print research memo"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Query Banner */}
      <div className="px-5 sm:px-8 py-3.5 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-400">Research Focus:</span>
          <span className="text-slate-100 font-medium font-serif italic truncate max-w-xl">
            &ldquo;{result.query}&rdquo;
          </span>
        </div>
        <span className="text-slate-500 capitalize bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
          {result.audienceMode === "lawyer" ? "Legal Practitioner Mode" : "Public Mode"}
        </span>
      </div>

      {/* Main Legal Content */}
      <div className="p-5 sm:p-8 space-y-6">
        <div className="prose prose-invert prose-amber max-w-none prose-headings:font-serif prose-headings:font-semibold prose-h1:text-xl sm:prose-h1:text-2xl prose-h2:text-lg sm:prose-h2:text-xl prose-h3:text-base prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-strong:text-amber-200 prose-blockquote:border-amber-500/50 prose-blockquote:bg-slate-950/60 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-table:border-slate-800 prose-th:bg-slate-950 prose-th:text-amber-300 prose-td:border-slate-800">
          <Markdown remarkPlugins={[remarkGfm]}>
            {result.content}
          </Markdown>
        </div>

        {/* Live SAFLII Sources Box */}
        {result.sources && result.sources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-800 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Verified Primary Authorities & Web Citations ({result.sources.length})
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Grounding Source Verification
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.sources.map((src, idx) => (
                <a
                  key={idx}
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 transition-all text-xs group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${src.isSaflii ? "bg-amber-400" : "bg-blue-400"}`}></span>
                    <span className="text-slate-200 group-hover:text-amber-300 font-medium truncate">
                      {src.title}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Safeguards & Professional Notice */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5 text-xs text-slate-400 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-300">Professional Legal Notice: </span>
            LexSA provides automated research assistance grounded in SAFLII case law and statutory provisions. It does not constitute formal legal representation. All citations, court rules, and subsequent judicial treatments should be verified independently before filing pleadings or tendering advice.
          </div>
        </div>

        {/* Follow-up Suggested Actions (Section 28) */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Suggested Next Actions (Section 28)
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {followUpActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => onFollowUp(action.prompt, action.mode)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-amber-500/10 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 text-xs font-medium transition-all"
              >
                <span>{action.label}</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
