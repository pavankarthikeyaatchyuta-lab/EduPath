import React, { useState } from 'react';
import { CapabilityMatrix, CapabilityItem } from '../types';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Award, HelpCircle, ArrowRight, Sparkles, Zap } from 'lucide-react';

interface SkillCoverageModalProps {
  isOpen: boolean;
  onClose: () => void;
  matrix?: CapabilityMatrix;
  percentage: number;
  onStartPractice: (skill: string) => void;
}

export const SkillCoverageModal: React.FC<SkillCoverageModalProps> = ({
  isOpen,
  onClose,
  matrix,
  percentage,
  onStartPractice
}) => {
  const [filter, setFilter] = useState<'all' | 'covered' | 'developing' | 'missing'>('all');

  if (!isOpen) return null;

  const allItems: CapabilityItem[] = [
    ...(matrix?.covered || []),
    ...(matrix?.developing || []),
    ...(matrix?.missing || [])
  ];

  const filteredItems = allItems.filter(item => {
    if (filter === 'covered') return item.status === 'covered';
    if (filter === 'developing') return item.status === 'developing';
    if (filter === 'missing') return item.status === 'missing';
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0f1523] border border-indigo-500/40 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 border border-indigo-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Target Role Capability Matrix
              </h2>
              <span className="text-xs text-cyan-300 font-semibold">
                Target: {matrix?.target_role || 'Generative AI Engineer'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Honest Pedagogical Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-gray-300 leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-300 font-bold uppercase tracking-wider text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              AI-Estimated Skill Coverage Formulation
            </div>
            <p>
              This coverage metric (<strong className="text-white">{percentage}%</strong>) is an AI-generated estimate based on verified project citations, inferred engineering capabilities, and canonical role benchmarks. It dynamically adjusts as you complete coding practices and assessments.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 text-center">
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Coverage</span>
              <span className="text-2xl font-black text-cyan-300">{percentage}%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-950 border border-emerald-500/30 text-center">
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">Covered (✓)</span>
              <span className="text-2xl font-black text-emerald-300">{matrix?.covered_count || 0}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-950 border border-amber-500/30 text-center">
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">Developing (⚠)</span>
              <span className="text-2xl font-black text-amber-300">{matrix?.developing_count || 0}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-950 border border-red-500/30 text-center">
              <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider block">Missing (✕)</span>
              <span className="text-2xl font-black text-red-300">{matrix?.missing_count || 0}</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <span className="text-xs font-semibold text-gray-400 mr-2">Filter:</span>
            {[
              { id: 'all', label: `All (${allItems.length})` },
              { id: 'covered', label: `Covered (${matrix?.covered_count || 0})` },
              { id: 'developing', label: `Developing (${matrix?.developing_count || 0})` },
              { id: 'missing', label: `Missing (${matrix?.missing_count || 0})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Capability Cards List */}
          <div className="space-y-3">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {item.status === 'covered' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {item.status === 'developing' && (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    {item.status === 'missing' && (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}

                    <span className="font-bold text-sm text-white">{item.skill}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">({item.category})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      item.importance === 'Critical'
                        ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                        : item.importance === 'High'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                    }`}>
                      {item.importance}
                    </span>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                      item.classification === 'demonstrated'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : item.classification === 'inferred'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {item.classification}
                    </span>
                  </div>
                </div>

                {/* Score vs Target Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>Demonstrated: <strong className="text-white">{item.current_proficiency}%</strong> ({item.current_level})</span>
                    <span>Role Target: <strong className="text-cyan-300">{item.expected_proficiency}%</strong></span>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full ${
                        item.status === 'covered' ? 'bg-emerald-400' :
                        item.status === 'developing' ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${Math.min(100, item.current_proficiency)}%` }}
                    />
                  </div>
                </div>

                {/* Source Evidence Citations */}
                <div className="p-2.5 rounded-lg bg-gray-950/80 border border-gray-800 text-xs text-gray-300">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                    Evidence Citation:
                  </span>
                  {item.evidence && item.evidence.length > 0 ? (
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {item.evidence.map((ev, i) => (
                        <li key={i} className="leading-relaxed">• {ev}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500 italic text-[11px]">No direct project evidence found.</span>
                  )}
                </div>

                {/* Direct Action for Missing / Developing */}
                {(item.status === 'missing' || item.status === 'developing') && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        onClose();
                        onStartPractice(item.skill);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      <Zap className="w-3 h-3" />
                      Target in Practice Sandbox
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
