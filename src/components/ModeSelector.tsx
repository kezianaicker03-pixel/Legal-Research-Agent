import React from "react";
import {
  Search,
  Scale,
  Briefcase,
  GitCompare,
  BookOpen,
  Columns2,
  CheckCircle2,
  FileText,
  Swords,
  FileCheck,
} from "lucide-react";
import { ResearchMode } from "../types";
import { RESEARCH_MODES } from "../data/sampleQueries";

interface ModeSelectorProps {
  currentMode: ResearchMode;
  onSelectMode: (mode: ResearchMode, defaultPrompt?: string) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Search":
        return <Search className="w-4 h-4 text-amber-400" />;
      case "Scale":
        return <Scale className="w-4 h-4 text-amber-400" />;
      case "Briefcase":
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      case "GitCompare":
        return <GitCompare className="w-4 h-4 text-amber-400" />;
      case "BookOpen":
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case "Columns2":
        return <Columns2 className="w-4 h-4 text-amber-400" />;
      case "CheckCircle2":
        return <CheckCircle2 className="w-4 h-4 text-amber-400" />;
      case "FileText":
        return <FileText className="w-4 h-4 text-amber-400" />;
      case "Swords":
        return <Swords className="w-4 h-4 text-amber-400" />;
      case "FileCheck":
        return <FileCheck className="w-4 h-4 text-amber-400" />;
      default:
        return <Scale className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
          <span>Choose Research Mode</span>
          <span className="text-[10px] text-slate-500 font-normal">
            (Select an action or search naturally below)
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {RESEARCH_MODES.map((mode) => {
          const isSelected = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id, mode.defaultPrompt)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? "bg-amber-500/10 border-amber-500/60 shadow-md shadow-amber-950/20 ring-1 ring-amber-500/30"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${isSelected ? "bg-amber-500/20" : "bg-slate-800 group-hover:bg-slate-700"}`}>
                    {getIcon(mode.iconName)}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  )}
                </div>
                <h4 className={`text-xs font-semibold tracking-tight ${isSelected ? "text-amber-300" : "text-slate-200"}`}>
                  {mode.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                {mode.shortDesc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
