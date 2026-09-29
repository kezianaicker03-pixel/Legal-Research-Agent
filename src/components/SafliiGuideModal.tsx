import React from "react";
import { X, BookOpen, ExternalLink, ShieldCheck, Search, Link2 } from "lucide-react";

interface SafliiGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafliiGuideModal: React.FC<SafliiGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const SAFLLII_COLLECTIONS = [
    { name: "Constitutional Court of South Africa (ZACC)", url: "https://www.saflii.org/za/cases/ZACC/", code: "ZACC" },
    { name: "Supreme Court of Appeal of South Africa (ZASCA)", url: "https://www.saflii.org/za/cases/ZASCA/", code: "ZASCA" },
    { name: "Gauteng Division, Pretoria (ZAGPPHC)", url: "https://www.saflii.org/za/cases/ZAGPPHC/", code: "ZAGPPHC" },
    { name: "Gauteng Local Division, Johannesburg (ZAGPJHC)", url: "https://www.saflii.org/za/cases/ZAGPJHC/", code: "ZAGPJHC" },
    { name: "Western Cape Division, Cape Town (ZAWCHC)", url: "https://www.saflii.org/za/cases/ZAWCHC/", code: "ZAWCHC" },
    { name: "KwaZulu-Natal High Courts (ZAKZDHC / ZAKZPHC)", url: "https://www.saflii.org/za/cases/ZAKZDHC/", code: "ZAKZDHC" },
    { name: "Labour Appeal Court of South Africa (ZALAC)", url: "https://www.saflii.org/za/cases/ZALAC/", code: "ZALAC" },
    { name: "Labour Court of South Africa (ZALC)", url: "https://www.saflii.org/za/cases/ZALC/", code: "ZALC" },
    { name: "Competition Appeal Court (ZACAC)", url: "https://www.saflii.org/za/cases/ZACAC/", code: "ZACAC" },
    { name: "Land Claims Court / Land Court (ZALCC)", url: "https://www.saflii.org/za/cases/ZALCC/", code: "ZALCC" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                <span>SAFLII Directory & Research Guide</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-normal">
                  saflii.org
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Southern African Legal Information Institute – Primary source for South African jurisprudence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          {/* SAFLII Overview */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-semibold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>SAFLII Primary Law Standard</span>
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              SAFLII provides free, open online access to legal judgments from all South African superior courts. Under LexSA rules, all research outputs prioritize verified SAFLII neutral citations e.g. <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded font-mono">[2023] ZACC 12</code> or <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded font-mono">[2021] ZASCA 45</code>.
            </p>
            <div className="pt-2">
              <a
                href="https://www.saflii.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                <span>Visit Main SAFLII Portal (saflii.org)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Databases */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Major Court Case Law Databases
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAFLLII_COLLECTIONS.map((db, idx) => (
                <a
                  key={idx}
                  href={db.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/40 transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 truncate block">
                      {db.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Database: {db.code}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>

          {/* Citation Guide */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              Neutral Citation Anatomy
            </h4>
            <div className="font-mono text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300">
              <span className="text-amber-400">Minister of Safety and Security v Van Duivenboden</span>{" "}
              <span className="text-emerald-400">[2002]</span>{" "}
              <span className="text-cyan-400">ZASCA</span>{" "}
              <span className="text-purple-400">79</span>;{" "}
              <span className="text-slate-400">2002 (6) SA 431 (SCA)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-1">
              <div><strong className="text-emerald-400">[Year]</strong>: Judgment Year</div>
              <div><strong className="text-cyan-400">Court Code</strong>: SAFLII identifier</div>
              <div><strong className="text-purple-400">Number</strong>: Sequential judgment #</div>
              <div><strong className="text-slate-400">Law Report</strong>: e.g. Juta / LexisNexis</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
