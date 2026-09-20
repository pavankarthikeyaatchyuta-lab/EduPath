import React from 'react';
import { SkillGap } from '../types';
import { Target, AlertTriangle, ArrowRight, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SkillGapViewProps {
  gaps: SkillGap[];
  onStartPractice: (skill: string) => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({ gaps, onStartPractice }) => {
  const topGaps = gaps.filter(g => g.priority === 'high').slice(0, 3);
  const mediumGaps = gaps.filter(g => g.priority === 'medium');
  const lowGaps = gaps.filter(g => g.priority === 'low');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Prioritized Skill Gap Analysis</h2>
        <p className="text-xs text-gray-400 mt-1">
          EduPath compares your evidenced capabilities against your target role to prioritize what you should learn first.
        </p>
      </div>

      {/* Top 3 High Priority Gaps */}
      <div>
        <div className="flex items-center gap-2 text-sm font-bold text-red-400 uppercase tracking-wider mb-4">
          <AlertTriangle className="w-4 h-4" />
          Top 3 High-Priority Gaps (Immediate Focus)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topGaps.map((gap, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-gradient-to-b from-gray-900 to-[#111827] border border-red-500/30 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-red-400 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                    Priority #{idx + 1}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">Score {gap.priority_score}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{gap.skill_name}</h3>
                <div className="text-xs text-indigo-400 font-medium mb-3">{gap.category}</div>

                <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-xs text-gray-300 space-y-1.5 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Level:</span>
                    <span className="font-semibold text-amber-400">{gap.current_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target Level:</span>
                    <span className="font-semibold text-emerald-400">{gap.target_level}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  {gap.reason}
                </p>
              </div>

              <button
                onClick={() => onStartPractice(gap.skill_name)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-300" />
                Practice This Gap
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Medium Priority Gaps */}
      {mediumGaps.length > 0 && (
        <div>
          <div className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">
            Medium-Priority Gaps (Scheduled for Weeks 3–4)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediumGaps.map((gap, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#111827] border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">{gap.skill_name}</span>
                  <span className="text-xs text-amber-400 font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    Medium
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{gap.reason}</p>
                <div className="text-[11px] text-gray-500">Target Objective: {gap.recommended_objective}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Priority Gaps */}
      {lowGaps.length > 0 && (
        <div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
            Low-Priority / Elective Gaps
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lowGaps.map((gap, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#111827] border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">{gap.skill_name}</span>
                  <span className="text-xs text-gray-400 px-2 py-0.5 rounded bg-gray-800">Low</span>
                </div>
                <p className="text-xs text-gray-400">{gap.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
