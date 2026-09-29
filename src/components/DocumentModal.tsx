import React, { useState } from "react";
import { X, FileText, Upload, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeDocument: (docText: string, specificQuestion: string) => void;
  initialDocText?: string;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeDocument,
  initialDocText = "",
}) => {
  const [docText, setDocText] = useState(initialDocText);
  const [docTitle, setDocTitle] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("Find weaknesses in this argument.");
  const [customQuestion, setCustomQuestion] = useState("");

  if (!isOpen) return null;

  const PRESET_DOCUMENT_QUESTIONS = [
    "Find weaknesses in this argument.",
    "What South African cases support this legal proposition?",
    "Find cases that contradict this submission.",
    "Summarise this judgment or pleading.",
    "What law and legislation apply to these facts?",
    "Are the legal citations and principles in this document accurate?",
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocTitle(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setDocText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyze = () => {
    if (!docText.trim()) return;
    const question = customQuestion.trim() || selectedPreset;
    onAnalyzeDocument(docText.trim(), question);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm sm:text-base">
                Legal Document Analysis (Section 26)
              </h3>
              <p className="text-xs text-slate-400">
                Pleadings, contracts, judgments, affidavits, heads of argument or correspondence
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

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* File Upload Drop Area */}
          <div className="border-2 border-dashed border-slate-700/80 hover:border-amber-500/50 rounded-xl p-4 text-center transition-colors bg-slate-950/40">
            <input
              type="file"
              id="file-upload"
              accept=".txt,.md,.rtf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <Upload className="w-6 h-6 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">
                {docTitle ? `Uploaded: ${docTitle}` : "Click to select a text document or drag and drop"}
              </span>
              <span className="text-[11px] text-slate-500">
                Supports TXT, Markdown, pleadings, or paste directly below
              </span>
            </label>
          </div>

          {/* Direct Paste Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Document Text (Pasted Content)
            </label>
            <textarea
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              placeholder="Paste the relevant extract from your pleading, contract clause, judgment, or affidavit here..."
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-mono"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>Characters: {docText.length}</span>
              {docText.length > 0 && (
                <button
                  type="button"
                  onClick={() => setDocText("")}
                  className="text-slate-400 hover:text-rose-400"
                >
                  Clear text
                </button>
              )}
            </div>
          </div>

          {/* Analysis Objective / Question */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Select Analysis Objective
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_DOCUMENT_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(q);
                    setCustomQuestion("");
                  }}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                    selectedPreset === q && !customQuestion
                      ? "bg-amber-500/10 border-amber-500/60 text-amber-300 font-medium"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span>{q}</span>
                  {selectedPreset === q && !customQuestion && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1.5" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                Or ask a specific question regarding this document:
              </label>
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g. Does clause 14.2 survive breach under South African contract law?"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Document text will be analysed against SAFLII authorities</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAnalyze}
              disabled={!docText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs tracking-wide shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Analyze with SAFLII</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
