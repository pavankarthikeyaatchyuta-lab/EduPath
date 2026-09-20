import React from 'react';
import { Sparkles, ArrowRight, Play, Compass, Target, Brain, Award, RefreshCw, CheckCircle2, ChevronRight, Zap, ShieldCheck, Clock, BookOpen, Layers, BarChart2 } from 'lucide-react';

interface LandingPageProps {
  onStartProfile: () => void;
  onLaunchDemo: () => void;
  onOpenBuildStory?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartProfile, onLaunchDemo, onOpenBuildStory }) => {
  return (
    <div className="min-h-screen bg-[#070913] text-white flex flex-col bg-grid-pattern relative">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Navigation */}
      <header className="border-b border-white/[0.07] bg-[#070913]/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              EduPath AI
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider text-indigo-300 ml-2.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              Agentic AI Hackathon 2026
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenBuildStory && (
            <button
              onClick={onOpenBuildStory}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/30 hover:bg-cyan-900/50 text-xs font-semibold border border-cyan-500/30 text-cyan-300 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Build Story
            </button>
          )}
          <button
            onClick={onLaunchDemo}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gray-900/90 hover:bg-gray-800 text-xs font-semibold border border-gray-700/80 text-gray-200 hover:text-white transition-all shadow-sm hover:border-gray-600"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span className="hidden sm:inline">3-Minute</span> Demo
          </button>
          <button
            onClick={onStartProfile}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            Build My Path
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-14 max-w-5xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6 backdrop-blur-sm animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Problem Statement 1: Personalized Learning & Skill Gap Agent
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] mb-6 text-slate-100">
          Your Career Goal. Your Skills. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
            One Adaptive Learning Path.
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mb-8 leading-relaxed font-normal">
          EduPath AI understands what you already know, identifies what you're missing, and <strong className="text-slate-200 font-semibold">continuously adapts your learning journey</strong> as you progress.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <button
            onClick={onStartProfile}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
          >
            Build My Learning Path
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onLaunchDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/80 hover:border-slate-600 shadow-md transition-all hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            Launch 3-Minute Demo (Alex Rivera)
          </button>
          {onOpenBuildStory && (
            <button
              onClick={onOpenBuildStory}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/50 text-cyan-300 font-semibold text-sm border border-cyan-500/30 transition-all hover:-translate-y-0.5"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              Build Story & LinkedIn Posts
            </button>
          )}
        </div>

        {/* THE PROBLEM vs THE EDUPATH APPROACH (Master Requirement 24) */}
        <div className="w-full max-w-4xl mx-auto mt-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-950/15 via-slate-900/90 to-indigo-950/20 border border-indigo-500/30 text-left grid grid-cols-1 md:grid-cols-2 gap-6 shadow-xl">
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-400 block">THE PROBLEM</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Learning resources are everywhere, but most learning paths are generic. Learners often don't know which skills they already have, which ones they are missing, or what they should learn next."
            </p>
          </div>
          <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-6">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 block">THE EDUPATH APPROACH</span>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              "EduPath builds a learner-specific skill state and continuously adapts the learning path based on demonstrated progress."
            </p>
          </div>
        </div>

        {/* Interactive Loop Visual */}
        <div className="w-full mt-10 p-6 sm:p-7 rounded-2xl glass-panel shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="text-left">
              <span className="text-[11px] uppercase font-bold text-indigo-400 tracking-wider block">
                The Adaptive Agentic Architecture
              </span>
              <span className="text-sm font-semibold text-slate-200">
                Continuous Closed-Loop Learning Engine
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Real-Time Dynamic Replanning
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-center">
            {[
              { step: '1. PROFILE', desc: 'Evidence extraction', icon: Brain, color: 'text-indigo-400', badge: 'Input' },
              { step: '2. GAPS', desc: 'Target role delta', icon: Target, color: 'text-cyan-400', badge: 'Analysis' },
              { step: '3. PLAN', desc: 'Personalized roadmap', icon: Compass, color: 'text-purple-400', badge: 'v1.0' },
              { step: '4. PRACTICE', desc: 'Hands-on task sandbox', icon: Zap, color: 'text-amber-400', badge: 'Active' },
              { step: '5. EVALUATE', desc: 'AI weakness detection', icon: Award, color: 'text-emerald-400', badge: 'Scored' },
              { step: '6. ADAPT', desc: 'Dynamic replan', icon: RefreshCw, color: 'text-pink-400', badge: 'v2.0' },
            ].map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center mb-2">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className="text-[11px] font-bold text-slate-200">{s.step}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{s.desc}</div>
                <span className="mt-2 text-[9px] font-semibold text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/60 border border-slate-700/60">
                  {s.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiator Comparison Section */}
      <section className="px-6 py-14 max-w-5xl mx-auto border-t border-white/[0.07]">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2.5">
            Static Syllabus vs. EduPath AI
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Why traditional courses leave learners frustrated, and how our multi-agent architecture solves it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Traditional Courses */}
          <div className="p-6 rounded-2xl bg-red-950/10 border border-red-500/20 space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wider">
              <span>✕ Traditional Online Courses</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Rigid 10-week syllabus:</strong> Forces all students through the exact same track, wasting time on concepts already mastered.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Assumption-based leveling:</strong> Treats all skills as either completely known or completely absent without evidence citations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>No pedagogical adaptation:</strong> Failing an assessment simply displays a low score, leaving the learner stuck on advanced tasks.</span>
              </li>
            </ul>
          </div>

          {/* EduPath AI */}
          <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-4 glow-border">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>✓ EduPath Agentic Adaptive AI</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Evidence-grounded skills:</strong> Distinguishes Demonstrated, Inferred, and Unknown skills backed by resume and project citations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Automated roadmap restructuring:</strong> When an assessment reveals retrieval weaknesses, the agent automatically injects prerequisite labs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Next Best Action clarity:</strong> The learner always knows the single highest-leverage task to tackle today to bridge their target role.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 py-14 max-w-5xl mx-auto border-t border-white/[0.07]">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Engineered for Modern AI Engineering
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Everything you need to advance from developer to production AI engineer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: Target,
              title: 'Competency Mapping',
              desc: 'Detailed role models for Generative AI Engineer, MLOps, Data Scientist, and Full Stack roles.',
              color: 'text-indigo-400'
            },
            {
              icon: ShieldCheck,
              title: 'Source Evidence Citations',
              desc: 'Understand exactly why EduPath rates you Advanced in Python and Beginner in Vector Search.',
              color: 'text-cyan-400'
            },
            {
              icon: RefreshCw,
              title: 'Versioned Roadmaps',
              desc: 'Inspect full roadmap version history (v1, v2) with clear "Why Did This Change?" explainability diffs.',
              color: 'text-purple-400'
            },
            {
              icon: Zap,
              title: 'Interactive Practice Sandbox',
              desc: 'Practice real document chunking, prompt injection, and similarity search in a Python workspace.',
              color: 'text-amber-400'
            },
            {
              icon: BarChart2,
              title: 'Persistent Struggle Detection',
              desc: 'Detects repeated stumbling blocks across attempts and triggers foundational remediation.',
              color: 'text-emerald-400'
            },
            {
              icon: Brain,
              title: 'Context-Aware AI Copilot',
              desc: 'Ask questions grounded in your live assessment results, roadmap changes, and portfolio.',
              color: 'text-pink-400'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-xl glass-card transition-all">
              <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center mb-3">
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <h3 className="font-bold text-sm text-slate-100 mb-1.5">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/[0.07] py-6 px-6 text-center text-xs text-slate-500">
        EduPath AI — Agentic AI Hackathon 2026 Submission. Built with FastAPI, SQLite (WAL Mode), React 19, TypeScript, and Gemini/Groq LLM Provider.
      </footer>
    </div>
  );
};
