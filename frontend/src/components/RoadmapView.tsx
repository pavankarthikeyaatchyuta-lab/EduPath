import React, { useState } from 'react';
import { Roadmap, WeekPlan, Activity } from '../types';
import { CheckCircle2, Clock, BookOpen, ExternalLink, RefreshCw, Zap, Sparkles, ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';

interface RoadmapViewProps {
  roadmap: Roadmap;
  weeks: WeekPlan[];
  versions: Roadmap[];
  onSelectVersion: (ver: number) => void;
  onActivityStatusChange: (actId: string, newStatus: string) => void;
  onStartPractice: (skill: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  weeks,
  versions,
  onSelectVersion,
  onActivityStatusChange,
  onStartPractice
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const isAdapted = roadmap.version > 1;
  const diff = roadmap.diff_summary;

  return (
    <div className="space-y-6">
      {/* Header & Version Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">{roadmap.title}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1">
              Version {roadmap.version} {isAdapted && '• Dynamically Adapted'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            {roadmap.change_reason || "Personalized weekly curriculum continuously calibrated against your demonstrated capabilities."}
          </p>
        </div>

        {/* Version Switcher */}
        {versions && versions.length > 1 && (
          <div className="flex items-center gap-2 bg-[#0f1523] border border-gray-800 p-1.5 rounded-xl">
            <span className="text-[11px] font-bold text-gray-400 px-2">Roadmap Versions:</span>
            {versions.map(v => (
              <button
                key={v.id}
                onClick={() => onSelectVersion(v.version)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  v.version === roadmap.version
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                v{v.version} {v.version > 1 ? '(Adapted)' : '(Initial)'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Adaptive Replanning Diff Banner if Version > 1 */}
      {isAdapted && diff && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-[#0f1523] border border-indigo-500/40 shadow-xl glow-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Dynamic Replanning Trace (v{diff.version_from || 1} ➔ v{roadmap.version})
            </div>
            <span className="text-[11px] text-cyan-300 font-mono">Pedagogical Trigger: Assessment Evaluation</span>
          </div>

          <p className="text-xs text-slate-200 mb-4 leading-relaxed font-normal">
            {diff.reason || "EduPath modified this roadmap based on your recent assessment performance."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {diff.added_activities && diff.added_activities.length > 0 && (
              <div className="p-3.5 rounded-xl bg-gray-950/80 border border-emerald-500/30">
                <span className="font-bold text-emerald-400 block mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Added Remedial Exercises (Prerequisite Injection):
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {diff.added_activities.map((act, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-black">+</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {diff.moved_activities && diff.moved_activities.length > 0 && (
              <div className="p-3.5 rounded-xl bg-gray-950/80 border border-amber-500/30">
                <span className="font-bold text-amber-400 block mb-2 flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4" /> Reordered Topics (Deferred for Foundational Mastery):
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {diff.moved_activities.map((act, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-black">↷</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Week Selector Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedWeek('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            selectedWeek === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-[#0f1523] border border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          All 4 Weeks
        </button>
        {weeks.map(w => (
          <button
            key={w.week_number}
            onClick={() => setSelectedWeek(w.week_number)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedWeek === w.week_number
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-[#0f1523] border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Week {w.week_number}
          </button>
        ))}
      </div>

      {/* Structured Multi-Week Timeline */}
      <div className="space-y-8">
        {weeks
          .filter(w => selectedWeek === 'all' || w.week_number === selectedWeek)
          .map(week => (
            <div key={week.week_number} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-cyan-300">
                  W{week.week_number}
                </div>
                <h3 className="text-base font-bold text-white">
                  Week {week.week_number}: {
                    week.week_number === 1 ? 'RAG Architecture & Document Retrieval Foundations' :
                    week.week_number === 2 ? 'Vector Databases & Dense Embedding Indexing' :
                    week.week_number === 3 ? 'AI Evaluation & Automated Groundedness Benchmarks' :
                    'Capstone Project: Production Enterprise Knowledge Agent'
                  }
                </h3>
              </div>

              {/* Activities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pl-4 border-l-2 border-gray-800 ml-4">
                {week.activities.map((activity: Activity) => {
                  const isNew = Boolean(activity.is_new_addition);
                  const isMoved = Boolean(activity.is_moved);
                  const isCompleted = activity.status === 'completed';

                  return (
                    <div
                      key={activity.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isNew
                          ? 'bg-gradient-to-r from-amber-950/20 via-purple-950/20 to-[#0f1523] border-amber-500/50 shadow-lg ring-1 ring-amber-500/30'
                          : isCompleted
                          ? 'bg-gray-900/30 border-gray-800/60 opacity-80'
                          : 'bg-[#0f1523] border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-800 text-indigo-300">
                              {activity.activity_type}
                            </span>
                            <span className="text-xs text-gray-300 font-semibold">{activity.skill_name}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isNew && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-black text-amber-300 flex items-center gap-1">
                                <Zap className="w-3 h-3" /> NEW
                              </span>
                            )}
                            {isMoved && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-[10px] font-semibold text-blue-300">
                                ↷ Deferred
                              </span>
                            )}
                            <span className="text-[11px] text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {activity.duration_min}m
                            </span>
                          </div>
                        </div>

                        <h4 className={`text-sm font-bold mb-1.5 ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                          {activity.title}
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed mb-4">{activity.description}</p>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-gray-800/80 text-xs">
                        {activity.resource_url ? (
                          <a
                            href={activity.resource_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium text-xs"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            {activity.resource_title || 'Resource'}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-500 italic text-[11px]">EduPath Interactive Sandbox</span>
                        )}

                        <div className="flex items-center gap-2">
                          {activity.activity_type === 'practice' || activity.activity_type === 'assessment' ? (
                            <button
                              onClick={() => onStartPractice(activity.skill_name)}
                              className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-200 hover:text-white font-semibold transition-all"
                            >
                              Launch Practice
                            </button>
                          ) : (
                            <button
                              onClick={() => onActivityStatusChange(activity.id, isCompleted ? 'pending' : 'completed')}
                              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                              }`}
                            >
                              {isCompleted ? '✓ Completed' : 'Mark Done'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
