import React, { useState } from "react";
import { Briefcase, ChevronDown, ChevronUp, Edit3, Check, Plus, Trash2, Shield } from "lucide-react";
import { LegalMatter } from "../types";

interface MatterOverviewProps {
  matter: LegalMatter;
  onUpdateMatter: (updated: LegalMatter) => void;
  onClearMatter: () => void;
}

export const MatterOverview: React.FC<MatterOverviewProps> = ({
  matter,
  onUpdateMatter,
  onClearMatter,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(matter.title);
  const [editedClientRef, setEditedClientRef] = useState(matter.clientRef || "");
  const [editedJurisdiction, setEditedJurisdiction] = useState(matter.jurisdiction);
  const [editedAreaOfLaw, setEditedAreaOfLaw] = useState(matter.areaOfLaw);
  const [newIssue, setNewIssue] = useState("");
  const [newQuestion, setNewQuestion] = useState("");

  const handleSave = () => {
    onUpdateMatter({
      ...matter,
      title: editedTitle.trim() || "Active Legal Matter",
      clientRef: editedClientRef.trim(),
      jurisdiction: editedJurisdiction.trim(),
      areaOfLaw: editedAreaOfLaw.trim(),
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleAddIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssue.trim()) return;
    onUpdateMatter({
      ...matter,
      issuesIdentified: [...matter.issuesIdentified, newIssue.trim()],
      updatedAt: new Date().toISOString(),
    });
    setNewIssue("");
  };

  const handleRemoveIssue = (index: number) => {
    const updated = [...matter.issuesIdentified];
    updated.splice(index, 1);
    onUpdateMatter({
      ...matter,
      issuesIdentified: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    onUpdateMatter({
      ...matter,
      outstandingResearch: [...matter.outstandingResearch, newQuestion.trim()],
      updatedAt: new Date().toISOString(),
    });
    setNewQuestion("");
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = [...matter.outstandingResearch];
    updated.splice(index, 1);
    onUpdateMatter({
      ...matter,
      outstandingResearch: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 transition-all">
      {/* Top Header / Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                Active Matter File
              </span>
              {matter.clientRef && (
                <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  Ref: {matter.clientRef}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-slate-100 truncate">
              {matter.title || "Untitled Matter"}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
            title="Edit Matter Details"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3 text-xs">
          {isEditing ? (
            <div className="space-y-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1">
                  Matter Title
                </label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">
                    Client / File Ref
                  </label>
                  <input
                    type="text"
                    value={editedClientRef}
                    onChange={(e) => setEditedClientRef(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">
                    Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={editedJurisdiction}
                    onChange={(e) => setEditedJurisdiction(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">
                    Area of Law
                  </label>
                  <input
                    type="text"
                    value={editedAreaOfLaw}
                    onChange={(e) => setEditedAreaOfLaw(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1 rounded-md text-slate-400 hover:text-slate-200 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-slate-950 font-semibold rounded-md text-xs hover:bg-amber-400 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Matter</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
              <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                <span className="text-[10px] text-slate-500 block">Jurisdiction</span>
                <span className="font-medium text-slate-200">{matter.jurisdiction}</span>
              </div>
              <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                <span className="text-[10px] text-slate-500 block">Area of Law</span>
                <span className="font-medium text-amber-300/90">{matter.areaOfLaw}</span>
              </div>
              <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                <span className="text-[10px] text-slate-500 block">Issues Logged</span>
                <span className="font-medium text-slate-200">
                  {matter.issuesIdentified.length} Questions
                </span>
              </div>
              <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                <span className="text-[10px] text-slate-500 block">Authorities Located</span>
                <span className="font-medium text-emerald-400">
                  {matter.keyAuthorities.length} Cases / Acts
                </span>
              </div>
            </div>
          )}

          {/* Issues Identified */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Issues Identified
            </span>
            {matter.issuesIdentified.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">
                No specific issues logged yet. As you ask questions, key issues can be logged here.
              </p>
            ) : (
              <ul className="space-y-1">
                {matter.issuesIdentified.map((issue, idx) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between gap-2 bg-slate-950/50 px-2.5 py-1.5 rounded-lg border border-slate-800/50 text-slate-200"
                  >
                    <span className="leading-snug">{issue}</span>
                    <button
                      onClick={() => handleRemoveIssue(idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                      title="Remove issue"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddIssue} className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
                placeholder="Add another legal issue to this matter..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Outstanding Research Questions */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Outstanding Research Questions
            </span>
            {matter.outstandingResearch.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">
                No pending questions logged.
              </p>
            ) : (
              <ul className="space-y-1">
                {matter.outstandingResearch.map((q, idx) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between gap-2 bg-slate-950/50 px-2.5 py-1.5 rounded-lg border border-slate-800/50 text-amber-200/80"
                  >
                    <span className="leading-snug">? {q}</span>
                    <button
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                      title="Remove question"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddQuestion} className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Log question for further investigation..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Log</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
