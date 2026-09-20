import React from 'react';
import { Activity } from '../types';
import { CheckCircle2, Clock, Play, SkipForward, HelpCircle, BookOpen, ExternalLink, Zap } from 'lucide-react';

interface TodayPlanProps {
  tasks: Activity[];
  onUpdateStatus: (actId: string, status: string) => void;
  onStartPractice: (skill: string) => void;
  onAskAI: (topic: string) => void;
}

export const TodayPlan: React.FC<TodayPlanProps> = ({ tasks, onUpdateStatus, onStartPractice, onAskAI }) => {
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Today's Learning Plan</h2>
          <p className="text-xs text-gray-400 mt-1">
            Curated daily bite-sized activities designed to keep your momentum steady and prevent tutorial burnout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-gray-400 font-medium">Daily Goal</div>
            <div className="text-sm font-bold text-white">{completedCount} of {tasks.length} Done</div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 flex items-center justify-center font-bold text-sm text-indigo-400">
            {Math.round((completedCount / Math.max(1, tasks.length)) * 100)}%
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task, idx) => {
          const isCompleted = task.status === 'completed';
          const isInProgress = task.status === 'in_progress';

          return (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition-all ${
                isCompleted
                  ? 'bg-gray-900/30 border-gray-800 opacity-70'
                  : isInProgress
                  ? 'bg-gradient-to-r from-indigo-950/40 to-[#111827] border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30'
                  : 'bg-[#111827] border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-indigo-400">
                    {idx + 1}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {task.activity_type}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-300 font-semibold">{task.skill_name}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {task.duration_min} min
                </div>
              </div>

              <h3 className={`text-base font-bold mb-1 ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                {task.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                {task.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800/80">
                <div className="flex items-center gap-2">
                  {task.resource_url ? (
                    <a
                      href={task.resource_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {task.resource_title || 'Resource'}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : null}

                  <button
                    onClick={() => onAskAI(task.title)}
                    className="text-xs text-gray-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors ml-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Ask Copilot
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {task.activity_type === 'practice' || task.activity_type === 'assessment' ? (
                    <button
                      onClick={() => onStartPractice(task.skill_name)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md transition-all"
                    >
                      <Zap className="w-3.5 h-3.5 text-cyan-200" />
                      Start Practice Task
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => onUpdateStatus(task.id, isCompleted ? 'pending' : 'completed')}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isCompleted ? 'Completed' : 'Mark Completed'}
                      </button>
                      <button
                        onClick={() => onUpdateStatus(task.id, 'skipped')}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs font-medium"
                      >
                        Skip
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
