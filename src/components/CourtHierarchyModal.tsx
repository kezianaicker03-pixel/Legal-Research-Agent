import React from "react";
import { X, Layers, ExternalLink, ShieldCheck, Scale, ArrowDown } from "lucide-react";
import { COURT_HIERARCHY_DATA } from "../data/sampleQueries";

interface CourtHierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CourtHierarchyModal: React.FC<CourtHierarchyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <Layers className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                <span>South African Court Hierarchy & Stare Decisis</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-normal">
                  Section 4
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Evaluating binding vs persuasive authority in South African legal research
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
          {/* Stare Decisis summary card */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-semibold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>The Doctrine of Precedent (Stare Decisis)</span>
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              In South African law, lower courts are strictly bound by the ratio decidendi of higher courts. Decisions of a High Court division bind single judges of that same division unless clearly wrong, and bind all Magistrates' Courts within its territorial jurisdiction. Decisions from other High Court divisions have persuasive authority.
            </p>
          </div>

          {/* Court Levels List */}
          <div className="space-y-3">
            {COURT_HIERARCHY_DATA.map((court, idx) => (
              <div
                key={court.code}
                className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 hover:border-amber-500/40 transition-colors space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs">
                      {idx + 1}
                    </span>
                    <h5 className="font-serif font-bold text-slate-100 text-sm">
                      {court.court} ({court.code})
                    </h5>
                  </div>
                  <a
                    href={court.safliiDatabase}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-medium"
                  >
                    <span>SAFLII Database</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">
                      Seat & Jurisdiction
                    </span>
                    <span className="text-slate-300">{court.seat}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">
                      Precedential Weight
                    </span>
                    <span className="text-emerald-400 font-medium">{court.weight}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 pt-1 border-t border-slate-900">
                  {court.status}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
