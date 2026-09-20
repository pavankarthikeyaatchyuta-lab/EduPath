import React, { useState } from 'react';
import { AgentLog } from '../types';
import { Cpu, CheckCircle2, RefreshCw, Zap, ChevronDown, ChevronUp, Brain, Target, Compass, Award } from 'lucide-react';

interface AgentActivityPanelProps {
  logs: AgentLog[];
}

export const AgentActivityPanel: React.FC<AgentActivityPanelProps> = ({ logs }) => {
  const [showTrace, setShowTrace] = useState(false);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Agent Orchestration Stream
          </h3>
        </div>

        <button
          onClick={() => setShowTrace(!showTrace)}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
        >
          {showTrace ? 'Hide Agent Trace' : 'View How EduPath Decided'}
          {showTrace ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expandable Agent Decision Flow Trace */}
      {showTrace && (
        <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-3 text-xs animate-fade-in">
          <div className="font-bold text-gray-200 mb-2 flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-purple-400" />
            Decision Logic & Evidence Flow
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 text-center text-[11px]">
            <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800">
              <span className="text-gray-400 block font-semibold mb-0.5">1. INPUT</span>
              <span className="text-gray-300">Resume & projects parsed</span>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800">
              <span className="text-indigo-400 block font-semibold mb-0.5">2. ANALYSIS</span>
              <span className="text-gray-300">Skills categorized by evidence</span>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800">
              <span className="text-cyan-400 block font-semibold mb-0.5">3. COMPARE</span>
              <span className="text-gray-300">Role competency mapping</span>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800">
              <span className="text-amber-400 block font-semibold mb-0.5">4. DECISION</span>
              <span className="text-gray-300">RAG flagged as #1 target gap</span>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800">
              <span className="text-emerald-400 block font-semibold mb-0.5">5. FEEDBACK</span>
              <span className="text-gray-300">Assessment score: 58%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/40">
              <span className="text-purple-300 block font-semibold mb-0.5">6. ADAPT</span>
              <span className="text-gray-200">+2 prerequisite exercises</span>
            </div>
          </div>
        </div>
      )}

      {/* Live Log Feed */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
        {logs && logs.length > 0 ? (
          logs.map(log => {
            const isAdapt = log.action_type === 'ROADMAP_ADAPTED';
            const isEval = log.action_type === 'ASSESSMENT_EVALUATED';

            return (
              <div
                key={log.id}
                className={`p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ${
                  isAdapt
                    ? 'bg-purple-950/20 border-purple-500/40 text-purple-200'
                    : isEval
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : 'bg-gray-900/60 border-gray-800/80 text-gray-300'
                }`}
              >
                {isAdapt ? (
                  <Zap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                ) : isEval ? (
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-white text-[11px]">{log.agent_name}</span>
                    <span className="text-[10px] text-gray-500">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-300">{log.message}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-xs text-gray-500 italic p-3 text-center">
            Agent stream initialized. Awaiting user interaction...
          </div>
        )}
      </div>
    </div>
  );
};
