import React from 'react';
import { DashboardData } from '../types';
import { Target, Zap, ArrowRight, Award, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, HelpCircle, RefreshCw, Calendar } from 'lucide-react';

interface DashboardProps {
  data: DashboardData;
  onNavigate: (view: string) => void;
  onStartPractice: () => void;
  onOpenExplainModal: () => void;
  onInspectCoverage?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onNavigate, onStartPractice, onOpenExplainModal, onInspectCoverage }) => {
  const { user, skill_coverage, top_gaps, roadmap, next_best_action, progress_metric } = data;
  const isAdapted = roadmap && roadmap.version > 1;

  return (
    <div className="space-y-6">
      {/* Top Banner if Roadmap was Adapted */}
      {isAdapted && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border border-indigo-500/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin-slow" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Roadmap Adapted to Version {roadmap.version}
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-[10px] text-indigo-300 font-semibold border border-indigo-500/30">
                  Dynamic Replan Active
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                {roadmap.change_reason || "Targeted prerequisite exercises added following your latest assessment."}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenExplainModal}
            className="px-4 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-semibold text-indigo-200 hover:text-white transition-all shrink-0"
          >
            Why Did My Roadmap Change?
          </button>
        </div>
      )}

      {/* Persistent Struggle Detection Alert Banner (Master Requirement 25) */}
      {data.persistent_struggles && data.persistent_struggles.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-3 shadow-md animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="font-bold text-amber-300 text-sm flex items-center justify-between">
              <span>Persistent Difficulty Detected on {data.persistent_struggles[0].skill_name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pattern Recognized
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {data.persistent_struggles[0].message}
            </p>
          </div>
        </div>
      )}

      {/* Greeting & Quick Stats Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Good morning, {user.name} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
            Targeting: <span className="text-cyan-400 font-semibold">{user.target_role}</span>
            <span className="text-gray-600">•</span>
            <span>{user.weekly_hours || 10}h / week availability</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('practice')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
          >
            <Zap className="w-4 h-4 text-cyan-300" />
            Launch Practice Task
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: AI Skill Coverage (Interactive, Requirement 14) */}
        <div
          onClick={onInspectCoverage}
          className="p-5 rounded-2xl bg-[#111827] border border-gray-800 hover:border-indigo-500/60 transition-all relative overflow-hidden cursor-pointer group shadow-sm hover:shadow-indigo-500/10"
          title="Click to inspect covered, developing, and missing capabilities"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
              AI Skill Coverage
              <span className="text-[10px] text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Inspect →
              </span>
            </span>
            <ShieldCheck className="w-4 h-4 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white group-hover:text-cyan-200 transition-colors">
              {skill_coverage.percentage}%
            </span>
            <span className="text-xs text-gray-400 font-medium">target readiness</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${skill_coverage.percentage}%` }}
            />
          </div>
          <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1 truncate mr-2">
              <HelpCircle className="w-3 h-3 text-gray-500 shrink-0" />
              <span className="truncate">{skill_coverage.label}</span>
            </div>
            <span className="text-[10px] text-indigo-400 font-semibold underline underline-offset-2 shrink-0">
              Details
            </span>
          </div>
        </div>

        {/* Metric 2: Top Priority Gap */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Top Priority Gap
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {top_gaps[0]?.skill_name || 'RAG'}
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-medium mt-2">
            High Severity • Priority Score {top_gaps[0]?.priority_score || 92}
          </div>
          <div className="text-[11px] text-gray-400 mt-2 truncate">
            {top_gaps[0]?.category || 'Information Retrieval'}
          </div>
        </div>

        {/* Metric 3: Today's Tasks */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Today's Progress
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {progress_metric.completed_tasks} / {progress_metric.total_tasks}
            </span>
            <span className="text-xs text-gray-400 font-medium">tasks done</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(progress_metric.completed_tasks / Math.max(1, progress_metric.total_tasks)) * 100}%` }}
            />
          </div>
          <div className="text-[11px] text-gray-400 mt-2">
            {progress_metric.completed_tasks >= 2 ? 'On track to meet weekly goal' : '1 task remaining today'}
          </div>
        </div>

        {/* Metric 4: Active Roadmap */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Active Roadmap
            </span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            Week {progress_metric.current_week} of 4
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300 font-medium mt-2">
            Roadmap Version {roadmap.version}
          </div>
          <div className="text-[11px] text-gray-400 mt-2 truncate">
            {roadmap.title || 'Curriculum in progress'}
          </div>
        </div>
      </div>

      {/* Next Best Action Card (Hero UX component) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-[#111827] to-cyan-950/30 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              YOUR NEXT BEST ACTION
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {next_best_action.title}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="font-semibold text-cyan-300">Why this action:</span> {next_best_action.reason}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
              <span>⏱ Estimated: {next_best_action.duration_min} minutes</span>
              <span>•</span>
              <span>Skill Target: <strong className="text-gray-200">{next_best_action.skill_name}</strong></span>
            </div>
          </div>

          <button
            onClick={onStartPractice}
            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all shrink-0 hover:scale-105"
          >
            Start Practice
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Two Column Grid: Top Gaps & Quick Skill Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Priority Gaps */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              Prioritized Skill Gaps
            </h3>
            <button
              onClick={() => onNavigate('gaps')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              View all gaps <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {top_gaps.slice(0, 3).map((gap, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{gap.skill_name}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">({gap.category})</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    gap.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {gap.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{gap.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Skill Map Quick View */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Current Capabilities
            </h3>
            <button
              onClick={() => onNavigate('skills')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Inspect Evidence <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {data.skills.slice(0, 5).map((skill, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-200">{skill.skill_name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
                      skill.classification === 'demonstrated'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : skill.classification === 'inferred'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {skill.classification}
                    </span>
                  </div>
                  <span className="font-mono text-gray-400">{skill.proficiency_score}%</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      skill.proficiency_score >= 75 ? 'bg-emerald-400' : skill.proficiency_score >= 50 ? 'bg-cyan-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${skill.proficiency_score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
