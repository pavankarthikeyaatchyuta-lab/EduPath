import React from 'react';
import { RoadmapDiff } from '../types';
import { X, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

interface AdaptiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  diff?: RoadmapDiff;
  version: number;
}

export const AdaptiveModal: React.FC<AdaptiveModalProps> = ({ isOpen, onClose, diff, version }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#111827] border border-indigo-500/50 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Why Did My Roadmap Change?</h3>
            <span className="text-xs text-indigo-300">Continuous Adaptation Engine • Version {version}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/30 text-xs text-gray-200 leading-relaxed mb-5">
          <span className="font-bold text-cyan-300 block mb-1">Trigger Event:</span>
          {diff?.reason || (
            "Your recent technical assessment indicated opportunities for improvement in foundational retrieval quality. " +
            "EduPath responded by rescheduling advanced deployment topics and inserting targeted prerequisite labs."
          )}
        </div>

        {/* Before vs After Comparison */}
        <div className="space-y-3 mb-5 text-xs">
          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
            <span className="text-gray-400 font-semibold block mb-1">Previously Scheduled:</span>
            <span className="text-gray-300">
              Direct progression into high-scale ChromaDB vector indexing and capstone full-stack agent integration.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-gray-900 border border-indigo-500/30">
            <span className="text-cyan-400 font-semibold block mb-1">Now Added & Reordered:</span>
            <ul className="space-y-1 text-gray-200">
              {diff?.added_activities?.map((act, i) => (
                <li key={i} className="flex items-center gap-1.5 text-emerald-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {act} (NEW)
                </li>
              )) || (
                <>
                  <li className="text-emerald-300 font-medium">✓ Retrieval Evaluation Practice (NEW)</li>
                  <li className="text-emerald-300 font-medium">✓ Chunking Strategies & Sentence Preservation (NEW)</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-400">
          <span className="font-semibold text-gray-300 block mb-0.5">Pedagogical Goal:</span>
          Ensure rock-solid context grounding and hallucination prevention before scaling up vector storage.
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            Got It, Back to Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};
