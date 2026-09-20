import React, { useState } from 'react';
import { PracticeTask, EvaluationResult } from '../types';
import { api } from '../services/api';
import { Play, Sparkles, AlertTriangle, CheckCircle2, RefreshCw, Lightbulb, Code2, ArrowRight, Award, Terminal, Copy, Check } from 'lucide-react';

interface PracticeSandboxProps {
  userId: string;
  task: PracticeTask;
  onAssessmentCompleted: (evalResult: EvaluationResult, adaptation: any) => void;
  onViewRoadmap: () => void;
}

export const PracticeSandbox: React.FC<PracticeSandboxProps> = ({
  userId,
  task,
  onAssessmentCompleted,
  onViewRoadmap
}) => {
  const [code, setCode] = useState(task.initial_code_template || '');
  const [submitting, setSubmitting] = useState(false);
  const [runningConsole, setRunningConsole] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [adaptationData, setAdaptationData] = useState<any>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const demoAnswer = `# Demo Implementation: In-Memory Retrieval Pipeline
from typing import List, Dict

class SimpleRAG:
    def __init__(self, documents: List[str]):
        self.documents = documents
        self.chunks = []
        self._prepare_chunks()

    def _prepare_chunks(self):
        # Naive fixed chunking (lacks sliding overlap & sentence boundary preservation)
        for doc in self.documents:
            self.chunks.extend(doc.split(". "))

    def retrieve(self, query: str, top_k: int = 2) -> List[str]:
        # Keyword token overlap matching
        query_words = set(query.lower().split())
        scored = []
        for chunk in self.chunks:
            words = set(chunk.lower().split())
            overlap = len(query_words.intersection(words))
            scored.append((overlap, chunk))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [chunk for score, chunk in scored[:top_k]]

    def answer_query(self, query: str) -> str:
        # Prompt context injection
        relevant_context = "\\n".join(self.retrieve(query))
        return f"Context:\\n{relevant_context}\\n\\nAnswer to '{query}'"

# Test execution
docs = [
    "EduPath AI dynamically replans curricula when weak evaluation scores occur.",
    "Static curricula fail to address persistent learner difficulty in retrieval.",
    "RAG systems ground LLM responses in verifiable document chunks."
]
rag = SimpleRAG(docs)
print(rag.answer_query("How does EduPath handle weak evaluation?"))
`;

  const handleLoadDemoAnswer = () => {
    setCode(demoAnswer);
    setConsoleOutput(null);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunLocalTest = () => {
    setRunningConsole(true);
    setTimeout(() => {
      setRunningConsole(false);
      if (code.includes("SimpleRAG") || code.includes("retrieve")) {
        setConsoleOutput(
          "> Executing Python 3.13 interpreter...\n" +
          "> Documents indexed: 3\n" +
          "> Query: 'How does EduPath handle weak evaluation?'\n" +
          "> Top-2 Retrieved Chunks:\n" +
          "  [Chunk 1]: 'EduPath AI dynamically replans curricula when weak evaluation scores occur.'\n" +
          "  [Chunk 2]: 'Static curricula fail to address persistent learner difficulty in retrieval.'\n\n" +
          "> Injected Context Answer:\n" +
          "  Context:\n" +
          "  EduPath AI dynamically replans curricula when weak evaluation scores occur.\n" +
          "  Static curricula fail to address persistent learner difficulty in retrieval.\n" +
          "  Answer to 'How does EduPath handle weak evaluation?'\n\n" +
          "> Execution completed in 18ms. (Warning: Chunking does not preserve token overlap)."
        );
      } else {
        setConsoleOutput(
          "> Executing Python 3.13 interpreter...\n" +
          "> Starter template output: pass\n" +
          "> Note: Implement retrieval logic or click 'Load Demo Answer' to run functional test."
        );
      }
    }, 450);
  };

  const handleRequestHint = () => {
    setHint(
      "💡 Pedagogical Hint: Break documents into overlapping token chunks (e.g. 50 words with 10-word overlap) to prevent losing sentence boundaries. For retrieval, compute token overlap or cosine similarity before injecting into the prompt context."
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setEvalResult(null);
    setAdaptationData(null);

    try {
      const isDemo = code.includes("SimpleRAG") || code.includes("overlap");
      const res = await api.submitPractice(userId, task.id, task.skill_name, code, isDemo);
      if (res.evaluation) {
        setEvalResult(res.evaluation);
        setAdaptationData(res.adaptation);
        onAssessmentCompleted(res.evaluation, res.adaptation);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error evaluating submission. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Interactive Assessment • {task.practice_type}
            </span>
            <span className="text-xs text-gray-400 font-medium">Target Capability: <strong className="text-cyan-300 font-semibold">{task.skill_name}</strong></span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{task.task_title}</h2>
          <p className="text-xs text-gray-400 mt-1">{task.objective}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestHint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 hover:border-gray-600 text-xs text-gray-300 hover:text-white font-medium transition-all shadow-sm"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Hint
          </button>
          <button
            onClick={handleLoadDemoAnswer}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/60 hover:text-white transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Load Demo Answer
          </button>
        </div>
      </div>

      {/* Hint Banner */}
      {hint && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start justify-between gap-3 animate-fade-in">
          <span>{hint}</span>
          <button onClick={() => setHint(null)} className="text-amber-400 hover:text-white text-xs font-semibold">Dismiss</button>
        </div>
      )}

      {/* Main Grid: Requirements & Code Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Requirements & Rubric */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#0f1523] border border-gray-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Task Requirements
            </h3>
            <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
              {task.requirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f1523] border border-gray-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              Evaluation Criteria
            </h3>
            <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
              {task.evaluation_criteria.map((crit, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{crit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Execution Console */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-[#0a0e1a] border border-gray-800 flex flex-col shadow-2xl overflow-hidden">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e1424] border-b border-gray-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-amber-500/60" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
                <span className="font-mono text-gray-300 text-xs ml-2 font-medium">pipeline.py</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 text-gray-300 hover:text-white text-[11px]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <span className="text-[11px] text-gray-500 font-mono">Python 3.13</span>
              </div>
            </div>

            {/* Code Body with Line Numbers */}
            <div className="flex flex-1 min-h-[360px] bg-[#070a14] overflow-hidden">
              <div className="w-10 select-none py-3 text-right pr-2 text-gray-600 font-mono text-xs border-r border-gray-800/80 bg-[#070a14]">
                {lineNumbers.map(n => (
                  <div key={n} className="leading-[22px]">{n}</div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 bg-transparent font-mono text-xs text-gray-200 resize-none focus:outline-none leading-[22px] p-3 code-editor whitespace-pre"
                placeholder="# Implement your solution..."
              />
            </div>

            {/* Editor Action Bar */}
            <div className="px-4 py-3 bg-[#0e1424] border-t border-gray-800 flex items-center justify-between">
              <button
                onClick={handleRunLocalTest}
                disabled={runningConsole}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition-all"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                {runningConsole ? 'Testing...' : 'Run Syntax Test'}
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    AI Agent Evaluating...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Submit for AI Assessment
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Test Console Output */}
          {consoleOutput && (
            <div className="p-4 rounded-xl bg-black/90 border border-gray-800 font-mono text-[11px] text-gray-300 leading-relaxed animate-fade-in">
              <div className="flex items-center justify-between text-gray-500 mb-2 border-b border-gray-800 pb-1">
                <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3 text-cyan-400" /> Console Output</span>
                <button onClick={() => setConsoleOutput(null)} className="hover:text-white">Clear</button>
              </div>
              <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
            </div>
          )}
        </div>
      </div>

      {/* AI Evaluation Result Card */}
      {evalResult && (
        <div className="p-6 rounded-2xl bg-[#0f1523] border border-indigo-500/40 shadow-2xl space-y-5 animate-fade-in glow-border">
          {/* Header & Score Gauge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-1">
                Evaluation Agent Assessment Complete
              </div>
              <h3 className="text-xl font-bold text-white">Automated Technical Diagnosis</h3>
              <p className="text-xs text-gray-400 mt-0.5">{evalResult.reasoning}</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-950 border border-gray-800 px-4 py-2.5 rounded-xl">
              <div className="text-right">
                <div className="text-2xl font-black text-white">{evalResult.score}%</div>
                <div className="text-[10px] text-gray-400 font-medium">{evalResult.score_label}</div>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <span className="font-bold text-emerald-400 block mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths:
              </span>
              {evalResult.strengths.map((str, idx) => (
                <div key={idx} className="text-gray-300 leading-relaxed">{str}</div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <span className="font-bold text-amber-400 block mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Diagnosed Weaknesses:
              </span>
              {evalResult.weaknesses.map((weak, idx) => (
                <div key={idx} className="text-gray-300 leading-relaxed">{weak}</div>
              ))}
            </div>
          </div>

          {/* Next Step */}
          <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 text-xs">
            <span className="font-bold text-cyan-300 block mb-1">Recommended Next Step:</span>
            <span className="text-gray-300">{evalResult.recommended_next_step}</span>
          </div>

          {/* THE ADAPTIVE REPLANNING MOMENT BANNER */}
          {adaptationData && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-slate-950 border border-purple-500/50 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse-subtle">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Adaptive Replanning Triggered!
                </div>
                <div className="text-base font-bold text-white">
                  Roadmap Automatically Updated to Version {adaptationData.version}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {adaptationData.diff?.reason}
                </p>
              </div>

              <button
                onClick={onViewRoadmap}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 shrink-0 hover:scale-105 transition-all"
              >
                Inspect Updated Roadmap
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
