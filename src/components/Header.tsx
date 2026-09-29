import React from "react";
import { Scale, BookOpen, Layers, ShieldCheck, UserCheck, Users, FileText, PlusCircle } from "lucide-react";
import { AudienceMode } from "../types";

interface HeaderProps {
  audienceMode: AudienceMode;
  onAudienceModeChange: (mode: AudienceMode) => void;
  onOpenHierarchy: () => void;
  onOpenSafliiGuide: () => void;
  onOpenDocModal: () => void;
  onNewMatter: () => void;
  hasActiveMatter: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  audienceMode,
  onAudienceModeChange,
  onOpenHierarchy,
  onOpenSafliiGuide,
  onOpenDocModal,
  onNewMatter,
  hasActiveMatter,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-950/40 border border-amber-400/30">
            <Scale className="w-5 h-5 text-slate-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-wider font-bold text-lg text-slate-100 flex items-center gap-1.5">
                Lex<span className="text-amber-400">SA</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                SAFLII Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              South African Legal Research Assistant & Case-Law Intelligence
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Switcher: Lawyer vs Public User */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex items-center text-xs">
            <button
              onClick={() => onAudienceModeChange("lawyer")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                audienceMode === "lawyer"
                  ? "bg-amber-500 text-slate-950 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Full professional legal citations, burden of proof, causes of action, and IRAC"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Lawyer Mode</span>
            </button>
            <button
              onClick={() => onAudienceModeChange("public")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                audienceMode === "public"
                  ? "bg-amber-500 text-slate-950 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Plain language explanations and guidance for members of the public"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Public Mode</span>
            </button>
          </div>

          {/* Quick utility triggers */}
          <button
            onClick={onOpenDocModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 text-xs font-medium transition-colors"
            title="Analyze contracts, pleadings, affidavits or judgments"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Document Analysis</span>
          </button>

          <button
            onClick={onOpenHierarchy}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 text-xs font-medium transition-colors"
            title="South African Court Hierarchy & Stare Decisis Rules"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Court Hierarchy</span>
          </button>

          <button
            onClick={onOpenSafliiGuide}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 text-xs font-medium transition-colors"
            title="SAFLII Primary Databases & Search Guidelines"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>SAFLII Directory</span>
          </button>

          <button
            onClick={onNewMatter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-medium transition-all"
            title="Clear and start a fresh research session or matter"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{hasActiveMatter ? "New Matter" : "Reset"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
