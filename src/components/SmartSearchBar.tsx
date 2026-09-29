import React, { useState, useEffect } from "react";
import { Search, Sparkles, ArrowRight, ExternalLink, Paperclip, X } from "lucide-react";
import { ResearchMode } from "../types";
import { SMART_SEARCH_EXAMPLES, RESEARCH_MODES } from "../data/sampleQueries";

interface SmartSearchBarProps {
  currentMode: ResearchMode;
  onSearch: (query: string, mode: ResearchMode) => void;
  isLoading: boolean;
  initialQuery?: string;
  onOpenDocModal: () => void;
  hasDocumentAttached?: boolean;
}

export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  currentMode,
  onSearch,
  isLoading,
  initialQuery = "",
  onOpenDocModal,
  hasDocumentAttached = false,
}) => {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const activeModeConfig = RESEARCH_MODES.find((m) => m.id === currentMode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !hasDocumentAttached) return;
    onSearch(query.trim(), currentMode);
  };

  const handleSelectExample = (exampleText: string) => {
    setQuery(exampleText);
    onSearch(exampleText, currentMode);
  };

  const directSafliiUrl = `https://www.saflii.org/cgi-bin/sinosrch.cgi?query=${encodeURIComponent(
    query.trim() || "South Africa"
  )}&results=50&submit=Search&mask_path=za%2Fcases`;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/40 relative">
      {/* Mode Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Current Focus:</span>
          <span className="font-semibold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {activeModeConfig?.title || "Legal Research"}
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span className="hidden sm:inline">Primary Case Source:</span>
          <a
            href={directSafliiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
            title="Search directly on Southern African Legal Information Institute"
          >
            <span>SAFLII.org</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={
              activeModeConfig?.promptPlaceholder ||
              "Describe client facts, ask a legal question, or search by case name, citation, or legal principle..."
            }
            rows={3}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-y min-h-[76px]"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors p-1"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenDocModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                hasDocumentAttached
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-amber-300"
              }`}
            >
              <Paperclip className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {hasDocumentAttached ? "Document Attached (Ready)" : "Attach Pleadings / Document"}
              </span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || (!query.trim() && !hasDocumentAttached)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-slate-950 font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-950/40 hover:shadow-amber-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Searching SAFLII & Analysing...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Execute Legal Research</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Search Examples */}
      <div className="mt-4 pt-3 border-t border-slate-800/70">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-2">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Try Smart South African Research Prompts:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SMART_SEARCH_EXAMPLES.slice(0, 5).map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectExample(ex)}
              className="text-[11px] bg-slate-950/60 hover:bg-amber-500/10 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/30 rounded-lg px-2.5 py-1 text-left transition-all"
            >
              "{ex}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
