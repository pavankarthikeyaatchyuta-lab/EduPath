import React from 'react';
import { ProgressReport } from '../types';
import { Award, CheckCircle2, Clock, Target, TrendingUp, Sparkles, Printer, ArrowRight } from 'lucide-react';

interface ProgressReportViewProps {
  report: ProgressReport;
  onNavigateToRoadmap: () => void;
}

export const ProgressReportView: React.FC<ProgressReportViewProps> = ({ report, onNavigateToRoadmap }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Periodic Progress Audit
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{report.title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">Generated on {report.date} by EduPath Evaluation Agent</p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-700 hover:border-gray-600 text-xs font-semibold text-gray-200 hover:text-white transition-all shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Print / Export Report
        </button>
      </div>

      {/* Trajectory Highlight Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-[#111827] to-cyan-950/40 border border-indigo-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              Active Skill Velocity
            </span>
            <h3 className="text-xl font-bold text-white">
              {report.recent_improvement.skill}: {report.recent_improvement.trajectory}
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Assessment Score: {report.recent_improvement.assessment_score}% (Bounded proficiency elevation)
            </p>
          </div>

          <button
            onClick={onNavigateToRoadmap}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all shrink-0"
          >
            Review Roadmap
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Acquired Skills */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Skills Acquired (75%+)
          </div>
          <div className="space-y-2">
            {report.skills_acquired.map((s, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-200 flex items-center justify-between">
                <span>{s}</span>
                <span className="text-emerald-400 text-[10px]">Verified</span>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <TrendingUp className="w-4 h-4" />
            In Progress (35% - 74%)
          </div>
          <div className="space-y-2">
            {report.skills_in_progress.map((s, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-200 flex items-center justify-between">
                <span>{s}</span>
                <span className="text-cyan-400 text-[10px]">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Remaining Gaps */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Target className="w-4 h-4" />
            Remaining Target Gaps
          </div>
          <div className="space-y-2">
            {report.remaining_gaps.map((s, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-200 flex items-center justify-between">
                <span>{s}</span>
                <span className="text-amber-400 text-[10px]">Scheduled</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Summary & Recommendations */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            AI Assessment Summary
          </h4>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            {report.ai_summary}
          </p>
        </div>

        <div className="pt-3 border-t border-gray-800/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
            Recommended Actionable Next Steps
          </h4>
          <ul className="space-y-1.5 text-xs text-gray-300">
            {report.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
