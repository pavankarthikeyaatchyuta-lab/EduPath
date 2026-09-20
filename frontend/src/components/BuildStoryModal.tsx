import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Copy, Check, Share2, Layers, BookOpen, Brain, Target, Compass, Zap, Award, RefreshCw, BarChart2 } from 'lucide-react';

interface BuildStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuildStoryModal: React.FC<BuildStoryModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'day1' | 'day2'>('day1');
  const [copiedDay1, setCopiedDay1] = useState(false);
  const [copiedDay2, setCopiedDay2] = useState(false);

  if (!isOpen) return null;

  const day1Post = `🚀 Agentic AI Hackathon 2026 — Day 1 Build Update: EduPath AI

Problem Statement 1: EduPath — Personalized Learning & Skill Gap Agent

Traditional online learning fails because of ONE fatal flaw: static syllabi. Whether you're a senior backend developer or an undergrad, platforms force everyone through the exact same 10-week syllabus. Worse: failing an assessment just gives you a red badge, leaving you stranded on advanced topics.

💡 Our Solution: EduPath AI
"Your Career Goal. Your Skills. One Adaptive Learning Path."

Today we designed our 7-Stage Continuous Learning Loop:
1️⃣ UNDERSTAND: Parses resumes & projects, tagging Demonstrated vs Inferred vs Unknown skills with proof.
2️⃣ IDENTIFY: Models target role capability benchmarks (e.g. GenAI Engineer) & scores skill deltas.
3️⃣ PLAN: Generates a personalized multi-week curriculum tailored to available weekly hours.
4️⃣ PRACTICE: Hands-on code sandbox with starter templates & evaluation criteria.
5️⃣ EVALUATE: Diagnostic AI evaluation that isolates exact conceptual failure modes.
6️⃣ ADAPT: Automated roadmap restructuring (v1 -> v2) that injects remedial prerequisite labs!
7️⃣ NEW PLAN: Loop repeats as the learner demonstrates mastery.

Multi-agent architecture built with 10 specialized agents, FastAPI, SQLite WAL mode, and React 19.

Tomorrow: Demoing the live adaptive replanning moment and automated code diagnosis! 🔥

#AgenticAIHackathon2026 #EduPathAI #GenerativeAI #AIagents #EdTech #BuildInPublic #AI`;

  const day2Post = `🏆 Agentic AI Hackathon 2026 — Day 2 Finale: EduPath AI is LIVE!

We just completed our production-ready adaptive career & learning agent for Problem Statement 1!

🔥 The Core Differentiator: Dynamic Curriculum Adaptation
EduPath does NOT create a static curriculum. It continuously adapts based on demonstrated code execution!

Here is the exact 3-minute demo flow we engineered:
1️⃣ Alex Rivera inputs target role: Generative AI Engineer.
2️⃣ Skill Gap Agent calculates 68% AI-estimated skill coverage and flags RAG as top priority gap.
3️⃣ Learning Planner generates Roadmap v1.
4️⃣ Alex submits code in our Interactive Python Sandbox.
5️⃣ Evaluation Agent diagnoses submission: Score 58%, pinpointing weak chunk overlap and retrieval evaluation.
6️⃣ ⚡ THE ADAPTIVE REPLANNING MOMENT:
   - Roadmap automatically upgrades to Version 2!
   - Injects: "+ Retrieval Evaluation Practice" & "+ Chunking Strategies Lab"
   - Reorders: Advanced Vector Indexing deferred until prerequisites are mastered.
7️⃣ "Why Did My Roadmap Change?" explainability panel provides transparent pedagogical rationale.
8️⃣ Learning Copilot answers questions grounded in live learner state!

Tech Stack:
⚡ Backend: FastAPI + SQLite WAL Concurrency + Gemini/Groq LLM Engine
⚡ Frontend: React 19 + TypeScript + Tailwind CSS v4
⚡ Testing: 100% test pass rate across unit and API integration suites.

Check out the demo and live architecture! 🚀

#AgenticAIHackathon2026 #EduPathAI #GenerativeAI #MachineLearning #AIengineers #AdaptiveLearning #BuildInPublic`;

  const handleCopyDay1 = () => {
    navigator.clipboard.writeText(day1Post);
    setCopiedDay1(true);
    setTimeout(() => setCopiedDay1(false), 2000);
  };

  const handleCopyDay2 = () => {
    navigator.clipboard.writeText(day2Post);
    setCopiedDay2(true);
    setTimeout(() => setCopiedDay2(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0f1523] border border-cyan-500/40 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Top Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Hackathon Build Story & LinkedIn Artifacts
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                  25% Criteria Weight
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Comprehensive Day 1 & Day 2 documentation, architecture blueprints, and copy-ready showcase posts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Day 1 vs Day 2 Tabs */}
        <div className="flex border-b border-gray-800 bg-[#111827]">
          <button
            onClick={() => setActiveTab('day1')}
            className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'day1'
                ? 'text-cyan-300 border-b-2 border-cyan-400 bg-cyan-950/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            Day 1: Problem Definition, Architecture & Initial Prototype
          </button>
          <button
            onClick={() => setActiveTab('day2')}
            className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'day2'
                ? 'text-indigo-300 border-b-2 border-indigo-400 bg-indigo-950/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Day 2: Working Adaptive Engine, Replanning Proof & Finale
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-gray-300 leading-relaxed">
          {activeTab === 'day1' ? (
            <div className="space-y-6 animate-fade-in">
              {/* Problem & Vision */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-950/15 border border-red-500/30 space-y-2">
                  <span className="font-bold text-red-400 block text-xs uppercase tracking-wider">
                    The Problem We Are Solving
                  </span>
                  <p className="text-gray-300">
                    Online learning paths are completely generic and static. Learners don't know what they know, don't know what they are missing, and when they fail a practice quiz, platforms just show a low percentage and move them forward anyway.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                  <span className="font-bold text-cyan-400 block text-xs uppercase tracking-wider">
                    The EduPath Hypothesis
                  </span>
                  <p className="text-gray-300">
                    By building an evidence-grounded learner state and a continuous closed loop (Understand ➔ Identify ➔ Plan ➔ Practice ➔ Evaluate ➔ Adapt), we can dynamically restructure the learning path in response to real performance.
                  </p>
                </div>
              </div>

              {/* 7-Stage Loop Blueprint */}
              <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase tracking-wider">
                    The 7-Stage Continuous Learning Loop
                  </span>
                  <span className="text-[10px] text-indigo-400 font-mono">Closed-Loop Autonomous Engine</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-[11px]">
                  <div className="p-2 rounded bg-gray-900 border border-gray-800 font-bold text-cyan-300">1. UNDERSTAND</div>
                  <div className="p-2 rounded bg-gray-900 border border-gray-800 font-bold text-indigo-300">2. IDENTIFY</div>
                  <div className="p-2 rounded bg-gray-900 border border-gray-800 font-bold text-purple-300">3. PLAN (v1)</div>
                  <div className="p-2 rounded bg-gray-900 border border-gray-800 font-bold text-amber-300">4. PRACTICE</div>
                  <div className="p-2 rounded bg-gray-900 border border-gray-800 font-bold text-emerald-300">5. EVALUATE</div>
                  <div className="p-2 rounded bg-gray-900 border border-gray-800 font-bold text-pink-300">6. ADAPT (v2)</div>
                </div>
              </div>

              {/* 10 Specialized Agents Roster */}
              <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-3">
                <span className="font-bold text-white text-xs uppercase tracking-wider block">
                  10 Specialized Logical Agents
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-gray-900 border border-gray-800/80">
                    <strong className="text-cyan-300">1. Profile Analyzer:</strong> Evidence extraction, tags Demonstrated vs Inferred.
                  </div>
                  <div className="p-2 rounded bg-gray-900 border border-gray-800/80">
                    <strong className="text-cyan-300">2. Target Role Analyzer:</strong> Canonical & dynamic competency benchmarking.
                  </div>
                  <div className="p-2 rounded bg-gray-900 border border-gray-800/80">
                    <strong className="text-cyan-300">3. Skill Gap Agent:</strong> Multi-factor gap severity & priority ranking.
                  </div>
                  <div className="p-2 rounded bg-gray-900 border border-gray-800/80">
                    <strong className="text-cyan-300">4. Learning Planner Agent:</strong> Structured multi-week curriculum synthesizer.
                  </div>
                  <div className="p-2 rounded bg-gray-900 border border-gray-800/80">
                    <strong className="text-cyan-300">5. Resource Agent:</strong> Curated, authoritative documentation recommendations.
                  </div>
                  <div className="p-2 rounded bg-gray-900 border border-gray-800/80">
                    <strong className="text-cyan-300">6. Practice Generator:</strong> Hands-on coding tasks with evaluation criteria.
                  </div>
                  <div className="p-2 rounded bg-gray-900 border border-gray-800/80">
                    <strong className="text-cyan-300">7. Evaluation Agent:</strong> Diagnostic assessment & root-cause weakness detection.
                  </div>
                  <div className="p-2 rounded bg-gray-900 border border-gray-800/80">
                    <strong className="text-cyan-300">8. Progress Engine:</strong> Bounded Bayesian updates & struggle detection.
                  </div>
                  <div className="p-2 rounded bg-gray-900 border border-gray-800/80">
                    <strong className="text-cyan-300">9. Adaptive Replanning Agent:</strong> The hero differentiator — dynamic restructuring.
                  </div>
                  <div className="p-2 rounded bg-gray-900 border border-gray-800/80">
                    <strong className="text-cyan-300">10. Learning Copilot:</strong> Context-aware mentor grounded in live learner state.
                  </div>
                </div>
              </div>

              {/* Copy Post Button */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-white block">Ready to share Day 1 on LinkedIn?</span>
                  <span className="text-[11px] text-gray-400">Copy the pre-formatted post with all key takeaways and hashtags.</span>
                </div>
                <button
                  onClick={handleCopyDay1}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-md shrink-0"
                >
                  {copiedDay1 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedDay1 ? 'Copied to Clipboard!' : 'Copy Day 1 Post'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Working Prototype Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Test Suite</span>
                  <div className="text-2xl font-black text-white">100% Pass</div>
                  <p className="text-[11px] text-gray-400">All unit and end-to-end API integration tests pass with 0 errors.</p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Storage Engine</span>
                  <div className="text-2xl font-black text-white">WAL Concurrency</div>
                  <p className="text-[11px] text-gray-400">Zero database locking with SQLite WAL mode and 30s busy timeout.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Deterministic Demo</span>
                  <div className="text-2xl font-black text-white">&lt; 3 Minutes</div>
                  <p className="text-[11px] text-gray-400">Reproduces full loop from baseline to adaptive replanning reliably.</p>
                </div>
              </div>

              {/* The Signature Adaptive Replanning Verification */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-950 border border-purple-500/50 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-purple-300 font-bold uppercase tracking-wider text-xs">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  The Signature Moment: Live Curriculum Adaptation (v1 ➔ v2)
                </div>
                <div className="space-y-2 text-xs text-gray-200">
                  <p>
                    When Alex Rivera scores <strong className="text-amber-400">58%</strong> on the RAG Document Q&A challenge, EduPath does NOT simply record a test score. The Adaptive Replanning Agent intercepts the weakness:
                  </p>
                  <div className="p-3.5 rounded-xl bg-gray-950/80 border border-gray-800 space-y-1.5 font-mono text-[11px]">
                    <div className="text-emerald-400">+ Added: Retrieval Evaluation Practice (NEW)</div>
                    <div className="text-emerald-400">+ Added: Chunking Strategies & Sentence Boundary Lab (NEW)</div>
                    <div className="text-amber-400">↷ Reordered: Vector Databases & Indexing Strategies (Deferred)</div>
                  </div>
                  <p className="text-gray-400 text-[11px]">
                    The roadmap version increments from <strong>v1 to v2</strong>, stored in the persistent database, and the "Why Did My Roadmap Change?" modal provides full pedagogical transparency.
                  </p>
                </div>
              </div>

              {/* Copy Day 2 Post */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-white block">Ready to share Day 2 on LinkedIn?</span>
                  <span className="text-[11px] text-gray-400">Copy the full release announcement with metrics and demo breakdown.</span>
                </div>
                <button
                  onClick={handleCopyDay2}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shrink-0"
                >
                  {copiedDay2 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedDay2 ? 'Copied to Clipboard!' : 'Copy Day 2 Post'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-950 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">
            EduPath AI • Agentic AI Hackathon 2026
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
