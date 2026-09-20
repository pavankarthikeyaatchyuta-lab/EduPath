import { DashboardData, Skill, SkillGap, Roadmap, WeekPlan, PracticeTask, AgentLog, ProgressReport, CapabilityMatrix } from '../types';

export const DEMO_USER_ID = "demo_alex_rivera";

export const MOCK_USER = {
  id: DEMO_USER_ID,
  name: "Alex Rivera",
  current_role: "Junior AI Developer",
  target_role: "Generative AI Engineer",
  career_goal: "Transition into building production-grade enterprise RAG and agentic AI systems.",
  weekly_hours: 10,
  learning_style: "hands-on"
};

export const MOCK_SKILLS: Skill[] = [
  {
    id: `${DEMO_USER_ID}_Python`,
    skill_name: "Python",
    category: "Core Programming",
    current_level: "Advanced",
    target_level: "Advanced",
    proficiency_score: 90,
    confidence: 0.95,
    classification: "demonstrated",
    evidence: ["Resume: Built backend REST APIs for AI Resume Analyzer using Python."],
    recommended_action: "Solid foundation. Leverage for agentic tooling."
  },
  {
    id: `${DEMO_USER_ID}_FastAPI`,
    skill_name: "FastAPI",
    category: "Application Layer",
    current_level: "Intermediate",
    target_level: "Advanced",
    proficiency_score: 80,
    confidence: 0.88,
    classification: "demonstrated",
    evidence: ["Resume: Developed high-throughput asynchronous REST endpoints with Pydantic validation."],
    recommended_action: "Enhance with streaming responses and WebSocket connections."
  },
  {
    id: `${DEMO_USER_ID}_ML`,
    skill_name: "Machine Learning",
    category: "Core AI",
    current_level: "Intermediate",
    target_level: "Advanced",
    proficiency_score: 70,
    confidence: 0.80,
    classification: "demonstrated",
    evidence: ["DeepLearning.AI Specialization certificate; built supervised classification models."],
    recommended_action: "Review cross-entropy loss and fine-tuning parameters."
  },
  {
    id: `${DEMO_USER_ID}_LLM_APIs`,
    skill_name: "LLM APIs",
    category: "LLMs & GenAI",
    current_level: "Intermediate",
    target_level: "Advanced",
    proficiency_score: 82,
    confidence: 0.85,
    classification: "demonstrated",
    evidence: ["Project: Student Assistant Chatbot integrated with OpenAI and Gemini API."],
    recommended_action: "Explore function calling and structured outputs."
  },
  {
    id: `${DEMO_USER_ID}_Prompt_Eng`,
    skill_name: "Prompt Engineering",
    category: "LLMs & GenAI",
    current_level: "Intermediate",
    target_level: "Advanced",
    proficiency_score: 78,
    confidence: 0.85,
    classification: "demonstrated",
    evidence: ["Project: Engineered system prompts, few-shot templates, and conversational memory."],
    recommended_action: "Experiment with DSPy and automatic prompt optimization."
  },
  {
    id: `${DEMO_USER_ID}_REST_APIs`,
    skill_name: "REST APIs",
    category: "Application Layer",
    current_level: "Intermediate",
    target_level: "Advanced",
    proficiency_score: 78,
    confidence: 0.82,
    classification: "inferred",
    evidence: ["Inferred from production FastAPI services in resume."],
    recommended_action: "Adopt OpenAPI schema versioning."
  },
  {
    id: `${DEMO_USER_ID}_SQL`,
    skill_name: "SQL",
    category: "Data Engineering",
    current_level: "Intermediate",
    target_level: "Intermediate",
    proficiency_score: 75,
    confidence: 0.78,
    classification: "demonstrated",
    evidence: ["PostgreSQL relational schemas for user session management."],
    recommended_action: "Current proficiency meets target expectations."
  },
  {
    id: `${DEMO_USER_ID}_Vector_DB`,
    skill_name: "Vector Databases",
    category: "Information Retrieval",
    current_level: "Beginner",
    target_level: "Advanced",
    proficiency_score: 38,
    confidence: 0.35,
    classification: "unknown",
    evidence: ["No direct project evidence found for Pinecone, Chroma, or dense index querying."],
    recommended_action: "Priority 2: Hands-on lab indexing chunks with ChromaDB."
  },
  {
    id: `${DEMO_USER_ID}_RAG`,
    skill_name: "RAG",
    category: "Information Retrieval",
    current_level: "Beginner",
    target_level: "Advanced",
    proficiency_score: 42,
    confidence: 0.40,
    classification: "unknown",
    evidence: ["No direct project evidence found for chunking, vector embeddings, or dense retrieval."],
    recommended_action: "Priority 1: Implement basic document ingestion and semantic search."
  },
  {
    id: `${DEMO_USER_ID}_AI_Eval`,
    skill_name: "AI Evaluation",
    category: "Quality & Trust",
    current_level: "Beginner",
    target_level: "Advanced",
    proficiency_score: 31,
    confidence: 0.35,
    classification: "unknown",
    evidence: ["No evidence of RAG triad benchmarks, hallucination detection, or Ragas."],
    recommended_action: "Priority 3: Benchmark retrieval context and answer groundedness."
  },
  {
    id: `${DEMO_USER_ID}_MLOps`,
    skill_name: "MLOps",
    category: "Production & Deploy",
    current_level: "Beginner",
    target_level: "Intermediate",
    proficiency_score: 22,
    confidence: 0.30,
    classification: "unknown",
    evidence: ["No CI/CD pipeline or model monitoring documented."],
    recommended_action: "Containerize pipeline with Docker and track latency metrics."
  },
  {
    id: `${DEMO_USER_ID}_Agentic_AI`,
    skill_name: "Agentic AI",
    category: "Advanced Systems",
    current_level: "Beginner",
    target_level: "Advanced",
    proficiency_score: 18,
    confidence: 0.25,
    classification: "unknown",
    evidence: ["No multi-agent frameworks (LangGraph, CrewAI) evidenced."],
    recommended_action: "Capstone goal: Build multi-agent orchestrator with replanning loop."
  }
];

export const MOCK_GAPS: SkillGap[] = [
  {
    id: "gap_rag",
    skill_name: "RAG",
    category: "Information Retrieval",
    current_level: "Beginner",
    target_level: "Advanced",
    gap_severity: "high",
    priority: "high",
    priority_score: 92,
    reason: "Your profile demonstrates LLM API usage but lacks evidence of document chunking, embeddings, and retrieval pipelines.",
    recommended_objective: "Master RAG core principles, vector stores, and prompt context injection."
  },
  {
    id: "gap_eval",
    skill_name: "AI Evaluation",
    category: "Quality & Trust",
    current_level: "Beginner",
    target_level: "Advanced",
    gap_severity: "high",
    priority: "high",
    priority_score: 86,
    reason: "Target role requires automated evaluation (RAG triad, faithfulness, latency benchmarks), not yet in your portfolio.",
    recommended_objective: "Learn Ragas and TruLens to benchmark retrieval context and answer groundedness."
  },
  {
    id: "gap_vectordb",
    skill_name: "Vector Databases",
    category: "Information Retrieval",
    current_level: "Beginner",
    target_level: "Advanced",
    gap_severity: "high",
    priority: "high",
    priority_score: 82,
    reason: "Target role requires scalable vector indexing and similarity search with HNSW or IVF indices.",
    recommended_objective: "Build and query embedding stores using ChromaDB and Pinecone."
  },
  {
    id: "gap_mlops",
    skill_name: "MLOps",
    category: "Production & Deploy",
    current_level: "Beginner",
    target_level: "Intermediate",
    gap_severity: "medium",
    priority: "medium",
    priority_score: 64,
    reason: "Production Generative AI engineers must monitor token usage, latency budgets, and guardrail telemetry.",
    recommended_objective: "Deploy LLM wrapper behind OpenTelemetry and Langfuse tracing."
  },
  {
    id: "gap_agentic",
    skill_name: "Agentic AI",
    category: "Advanced Systems",
    current_level: "Beginner",
    target_level: "Advanced",
    gap_severity: "medium",
    priority: "medium",
    priority_score: 60,
    reason: "Autonomous multi-agent planning and reflection systems are core to next-generation AI workflows.",
    recommended_objective: "Construct autonomous agents with tool-calling and self-correction loops."
  }
];

export const MOCK_ACTIVITIES = [
  {
    id: "act_1",
    roadmap_id: "roadmap_demo_v1",
    week_number: 1,
    sequence_order: 1,
    title: "Deep Dive: Dense Embeddings & Distance Metrics",
    activity_type: "learn" as const,
    skill_name: "RAG",
    duration_min: 60,
    description: "Study cosine similarity vs dot product vs euclidean distance in high-dimensional text embeddings.",
    status: "completed" as const,
    is_new_addition: 0,
    is_moved: 0,
    score: null,
    resource_title: "Sentence Transformers Guide",
    resource_url: "https://www.sbert.net/",
    resource_type: "documentation"
  },
  {
    id: "act_2",
    roadmap_id: "roadmap_demo_v1",
    week_number: 1,
    sequence_order: 2,
    title: "Document Ingestion & Chunking Strategies",
    activity_type: "learn" as const,
    skill_name: "RAG",
    duration_min: 75,
    description: "Compare fixed-size, recursive, and semantic chunking on unstructured PDF technical manuals.",
    status: "in_progress" as const,
    is_new_addition: 0,
    is_moved: 0,
    score: null,
    resource_title: "Pinecone Chunking Strategies Guide",
    resource_url: "https://www.pinecone.io/learn/chunking-strategies/",
    resource_type: "article"
  },
  {
    id: "act_3",
    roadmap_id: "roadmap_demo_v1",
    week_number: 1,
    sequence_order: 3,
    title: "Hands-on Practice: Recursive Chunking Pipeline",
    activity_type: "practice" as const,
    skill_name: "RAG",
    duration_min: 90,
    description: "Build a Python function to parse raw text, split into token chunks with 15% overlap, and attach source metadata.",
    status: "pending" as const,
    is_new_addition: 0,
    is_moved: 0,
    score: null,
    resource_title: "Interactive Sandbox Task",
    resource_url: "#sandbox",
    resource_type: "sandbox"
  },
  {
    id: "act_4",
    roadmap_id: "roadmap_demo_v1",
    week_number: 2,
    sequence_order: 1,
    title: "Local Vector Store Setup with ChromaDB",
    activity_type: "practice" as const,
    skill_name: "Vector Databases",
    duration_min: 75,
    description: "Initialize an embedded Chroma collection, configure cosine distance space, and upsert document batches.",
    status: "pending" as const,
    is_new_addition: 0,
    is_moved: 0,
    score: null,
    resource_title: "ChromaDB Quickstart Docs",
    resource_url: "https://docs.trychroma.com/",
    resource_type: "documentation"
  },
  {
    id: "act_5",
    roadmap_id: "roadmap_demo_v1",
    week_number: 2,
    sequence_order: 2,
    title: "Hybrid Search: Dense Vectors + BM25 Lexical",
    activity_type: "learn" as const,
    skill_name: "RAG",
    duration_min: 60,
    description: "Understand reciprocal rank fusion (RRF) to combine keyword exact match with semantic vector retrieval.",
    status: "pending" as const,
    is_new_addition: 0,
    is_moved: 0,
    score: null,
    resource_title: "Reciprocal Rank Fusion in Practice",
    resource_url: "https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf",
    resource_type: "paper"
  },
  {
    id: "act_6",
    roadmap_id: "roadmap_demo_v1",
    week_number: 2,
    sequence_order: 3,
    title: "Context Window Packing & Prompt Construction",
    activity_type: "project" as const,
    skill_name: "Prompt Engineering",
    duration_min: 90,
    description: "Design dynamic system prompts that inject retrieved chunks while maintaining strict token limits and citations.",
    status: "pending" as const,
    is_new_addition: 0,
    is_moved: 0,
    score: null,
    resource_title: "Anthropic Prompt Engineering Interactive Tutorial",
    resource_url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering",
    resource_type: "tutorial"
  },
  {
    id: "act_7",
    roadmap_id: "roadmap_demo_v1",
    week_number: 3,
    sequence_order: 1,
    title: "The RAG Triad: Faithfulness, Answer Relevance, Context Recall",
    activity_type: "learn" as const,
    skill_name: "AI Evaluation",
    duration_min: 75,
    description: "Study automated LLM-as-a-judge evaluation frameworks to detect hallucinations and benchmark retrieval precision.",
    status: "pending" as const,
    is_new_addition: 0,
    is_moved: 0,
    score: null,
    resource_title: "TruLens RAG Triad Documentation",
    resource_url: "https://www.trulens.org/",
    resource_type: "documentation"
  },
  {
    id: "act_8",
    roadmap_id: "roadmap_demo_v1",
    week_number: 3,
    sequence_order: 2,
    title: "Automated Test Suite with Ragas Framework",
    activity_type: "practice" as const,
    skill_name: "AI Evaluation",
    duration_min: 90,
    description: "Create a synthetic evaluation dataset of 25 question-answer pairs and execute batch faithfulness scoring.",
    status: "pending" as const,
    is_new_addition: 0,
    is_moved: 0,
    score: null,
    resource_title: "Ragas Evaluation Documentation",
    resource_url: "https://docs.ragas.io/",
    resource_type: "documentation"
  },
  {
    id: "act_9",
    roadmap_id: "roadmap_demo_v1",
    week_number: 3,
    sequence_order: 3,
    title: "Mid-Curriculum Milestone Assessment",
    activity_type: "assessment" as const,
    skill_name: "AI Evaluation",
    duration_min: 60,
    description: "Comprehensive evaluation of your retrieval accuracy and faithfulness pipeline under challenging distractor queries.",
    status: "pending" as const,
    is_new_addition: 0,
    is_moved: 0,
    score: null,
    resource_title: "Milestone Benchmark Test",
    resource_url: "#assessment",
    resource_type: "assessment"
  },
  {
    id: "act_10",
    roadmap_id: "roadmap_demo_v1",
    week_number: 4,
    sequence_order: 1,
    title: "Agentic Tool Calling & ReAct Loops",
    activity_type: "learn" as const,
    skill_name: "Agentic AI",
    duration_min: 80,
    description: "Formulate Thought-Action-Observation loops allowing agents to query databases and invoke APIs dynamically.",
    status: "pending" as const,
    is_new_addition: 0,
    is_moved: 0,
    score: null,
    resource_title: "ReAct: Synergizing Reasoning and Acting in Language Models",
    resource_url: "https://arxiv.org/abs/2210.03629",
    resource_type: "paper"
  },
  {
    id: "act_11",
    roadmap_id: "roadmap_demo_v1",
    week_number: 4,
    sequence_order: 2,
    title: "Observability & Guardrails with Langfuse",
    activity_type: "practice" as const,
    skill_name: "MLOps",
    duration_min: 75,
    description: "Instrument FastAPI endpoints to record token latency, cost metrics, and user feedback traces.",
    status: "pending" as const,
    is_new_addition: 0,
    is_moved: 0,
    score: null,
    resource_title: "Langfuse Open Source LLM Engineering",
    resource_url: "https://langfuse.com/",
    resource_type: "documentation"
  },
  {
    id: "act_12",
    roadmap_id: "roadmap_demo_v1",
    week_number: 4,
    sequence_order: 3,
    title: "Capstone Project: Production Multi-Agent RAG Engine",
    activity_type: "project" as const,
    skill_name: "Agentic AI",
    duration_min: 180,
    description: "Engineer an end-to-end RAG system with query routing, self-correction, Chroma vector store, and automated evaluation.",
    status: "pending" as const,
    is_new_addition: 0,
    is_moved: 0,
    score: null,
    resource_title: "Capstone GitHub Template",
    resource_url: "https://github.com/topics/rag-agent",
    resource_type: "repository"
  }
];

export const MOCK_ROADMAP: Roadmap = {
  id: "roadmap_demo_v1",
  user_id: DEMO_USER_ID,
  version: 1,
  title: "EduPath 4-Week Adaptive Roadmap for Generative AI Engineer",
  is_active: 1,
  change_reason: "Initial personalized roadmap synthesized from profile skill gaps and prerequisite dependency trees.",
  diff_summary: {
    added: ["Dense Embeddings & Distance Metrics", "Document Ingestion & Chunking Strategies", "Recursive Chunking Pipeline"],
    reason: "Initial structured learning pathway created."
  },
  created_at: new Date().toISOString()
};

export const MOCK_ROADMAP_V2: Roadmap = {
  id: "roadmap_demo_v2",
  user_id: DEMO_USER_ID,
  version: 2,
  title: "EduPath Adaptive Roadmap (v2 - Reinforced Foundations)",
  is_active: 1,
  change_reason: "Adaptive Replanning Agent detected struggling performance on Recursive Chunking (Score: 58/100). Foundational prerequisite activity inserted.",
  diff_summary: {
    version_from: 1,
    version_to: 2,
    trigger_skill: "RAG",
    trigger_score: 58,
    weakness_detected: "Sentence boundary preservation and token clipping issues.",
    added_activities: ["Prerequisite Drill: Sentence Boundary Preservation in Document Chunking"],
    moved_activities: ["Local Vector Store Setup with ChromaDB shifted by 2 days to protect foundational mastery"],
    reason: "Targeted prerequisite drill inserted immediately to address specific score deficiency before advancing."
  },
  created_at: new Date().toISOString()
};

export const MOCK_WEEKS: WeekPlan[] = [
  { week_number: 1, activities: MOCK_ACTIVITIES.slice(0, 3) },
  { week_number: 2, activities: MOCK_ACTIVITIES.slice(3, 6) },
  { week_number: 3, activities: MOCK_ACTIVITIES.slice(6, 9) },
  { week_number: 4, activities: MOCK_ACTIVITIES.slice(9, 12) }
];

export const MOCK_WEEKS_V2: WeekPlan[] = [
  {
    week_number: 1,
    activities: [
      MOCK_ACTIVITIES[0],
      MOCK_ACTIVITIES[1],
      MOCK_ACTIVITIES[2],
      {
        id: "act_prep_1",
        roadmap_id: "roadmap_demo_v2",
        week_number: 1,
        sequence_order: 4,
        title: "⚡ Prerequisite Drill: Sentence Boundary Preservation in Chunking",
        activity_type: "practice" as const,
        skill_name: "RAG",
        duration_min: 45,
        description: "Adaptive intervention: Build regex-aware sliding token splitter that never cleaves sentences in half.",
        status: "pending" as const,
        is_new_addition: 1,
        is_moved: 0,
        score: null,
        resource_title: "Regex Token Boundary Strategies",
        resource_url: "#drill",
        resource_type: "drill"
      }
    ]
  },
  { week_number: 2, activities: MOCK_ACTIVITIES.slice(3, 6) },
  { week_number: 3, activities: MOCK_ACTIVITIES.slice(6, 9) },
  { week_number: 4, activities: MOCK_ACTIVITIES.slice(9, 12) }
];

export const MOCK_PRACTICE_TASK: PracticeTask = {
  id: "task_rag_chunking_01",
  skill_name: "RAG",
  task_title: "Implement Production-Ready Recursive Token Chunking with Metadata",
  practice_type: "coding_challenge",
  objective: "Build a resilient text chunking function that splits technical manuals into overlapping segments while preserving paragraph integrity.",
  requirements: [
    "Accept raw text string, chunk_size (e.g. 500 characters), and chunk_overlap (e.g. 100 characters).",
    "Preserve sentence boundaries without truncating words in the middle.",
    "Return a list of dicts with keys: 'chunk_id', 'text', 'char_count', and 'overlap_prev'.",
    "Provide basic edge case handling for empty strings or strings shorter than chunk_size."
  ],
  evaluation_criteria: [
    "Adherence to token/character size constraints (25% weight)",
    "Sentence and word boundary preservation (35% weight)",
    "Correct overlap offset calculations (25% weight)",
    "Clean error handling and docstring formatting (15% weight)"
  ],
  initial_code_template: `def chunk_document(text: str, chunk_size: int = 500, chunk_overlap: int = 100) -> list[dict]:
    """
    Splits input text into overlapping chunks while preserving sentence boundaries.
    
    Args:
        text: Raw document text to chunk
        chunk_size: Target maximum characters per chunk
        chunk_overlap: Overlapping characters between consecutive chunks
        
    Returns:
        List of dictionaries with keys: chunk_id, text, char_count, overlap_prev
    """
    if not text or not text.strip():
        return []
        
    chunks = []
    # TODO: Implement recursive or boundary-aware sliding window splitting
    # Hint: Check for punctuation boundaries ('. ', '\\n\\n') near the chunk limit
    
    return chunks`,
  difficulty: "Intermediate"
};

export const MOCK_CAPABILITY_MATRIX: CapabilityMatrix = {
  target_role: "Generative AI Engineer",
  total_capabilities: 13,
  covered_count: 6,
  developing_count: 2,
  missing_count: 5,
  coverage_percentage: 68,
  covered: [
    {
      skill: "Python",
      category: "Core Programming",
      importance: "Critical",
      expected_proficiency: 85,
      current_proficiency: 90,
      current_level: "Advanced",
      classification: "demonstrated",
      evidence: ["Resume: Built backend REST APIs for AI Resume Analyzer."],
      status: "covered"
    },
    {
      skill: "FastAPI",
      category: "Application Layer",
      importance: "High",
      expected_proficiency: 75,
      current_proficiency: 80,
      current_level: "Intermediate",
      classification: "demonstrated",
      evidence: ["Resume: Developed high-throughput asynchronous REST endpoints."],
      status: "covered"
    },
    {
      skill: "LLM APIs",
      category: "LLMs & GenAI",
      importance: "Critical",
      expected_proficiency: 80,
      current_proficiency: 82,
      current_level: "Intermediate",
      classification: "demonstrated",
      evidence: ["Project: Student Assistant Chatbot with OpenAI/Gemini."],
      status: "covered"
    },
    {
      skill: "Prompt Engineering",
      category: "LLMs & GenAI",
      importance: "High",
      expected_proficiency: 75,
      current_proficiency: 78,
      current_level: "Intermediate",
      classification: "demonstrated",
      evidence: ["Project: Engineered system prompts, few-shot templates."],
      status: "covered"
    },
    {
      skill: "Machine Learning",
      category: "Core AI",
      importance: "High",
      expected_proficiency: 70,
      current_proficiency: 70,
      current_level: "Intermediate",
      classification: "demonstrated",
      evidence: ["DeepLearning.AI Specialization coursework."],
      status: "covered"
    },
    {
      skill: "REST APIs",
      category: "Application Layer",
      importance: "Medium",
      expected_proficiency: 70,
      current_proficiency: 78,
      current_level: "Intermediate",
      classification: "inferred",
      evidence: ["Inferred from FastAPI backend services."],
      status: "covered"
    }
  ],
  developing: [
    {
      skill: "Deep Learning",
      category: "Core AI",
      importance: "High",
      expected_proficiency: 75,
      current_proficiency: 68,
      current_level: "Intermediate",
      classification: "inferred",
      evidence: ["Inferred from neural net coursework."],
      status: "developing"
    },
    {
      skill: "SQL",
      category: "Data Engineering",
      importance: "Medium",
      expected_proficiency: 80,
      current_proficiency: 75,
      current_level: "Intermediate",
      classification: "demonstrated",
      evidence: ["PostgreSQL relational schemas."],
      status: "developing"
    }
  ],
  missing: [
    {
      skill: "RAG",
      category: "Information Retrieval",
      importance: "Critical",
      expected_proficiency: 85,
      current_proficiency: 42,
      current_level: "Beginner",
      classification: "unknown",
      evidence: ["No document chunking or vector retrieval evidenced in portfolio."],
      status: "missing"
    },
    {
      skill: "AI Evaluation",
      category: "Quality & Trust",
      importance: "High",
      expected_proficiency: 80,
      current_proficiency: 31,
      current_level: "Beginner",
      classification: "unknown",
      evidence: ["No RAG triad or hallucination benchmark telemetry."],
      status: "missing"
    },
    {
      skill: "Vector Databases",
      category: "Information Retrieval",
      importance: "High",
      expected_proficiency: 80,
      current_proficiency: 38,
      current_level: "Beginner",
      classification: "unknown",
      evidence: ["No index management (Chroma/Pinecone) documented."],
      status: "missing"
    },
    {
      skill: "MLOps",
      category: "Production & Deploy",
      importance: "Medium",
      expected_proficiency: 70,
      current_proficiency: 22,
      current_level: "Beginner",
      classification: "unknown",
      evidence: ["No containerized CI/CD or tracing traces."],
      status: "missing"
    },
    {
      skill: "Agentic AI",
      category: "Advanced Systems",
      importance: "High",
      expected_proficiency: 75,
      current_proficiency: 18,
      current_level: "Beginner",
      classification: "unknown",
      evidence: ["No autonomous planning or tool orchestration loops."],
      status: "missing"
    }
  ]
};

export const MOCK_AGENT_LOGS: AgentLog[] = [
  {
    id: "log_1",
    user_id: DEMO_USER_ID,
    agent_name: "Profile Analyzer",
    action_type: "profile_parsed",
    message: "Processed Alex Rivera's background. Discovered 6 demonstrated skills from resume & GitHub projects.",
    details: { confidence_avg: 0.88, source: "resume_projects" },
    timestamp: "10 mins ago"
  },
  {
    id: "log_2",
    user_id: DEMO_USER_ID,
    agent_name: "Target Role Analyzer",
    action_type: "taxonomy_mapped",
    message: "Deconstructed Generative AI Engineer into 13 requisite competencies across 6 core pillars.",
    details: { target_role: "Generative AI Engineer", critical_skills: 4 },
    timestamp: "9 mins ago"
  },
  {
    id: "log_3",
    user_id: DEMO_USER_ID,
    agent_name: "Skill Gap Agent",
    action_type: "gaps_identified",
    message: "Identified 5 critical skill gaps. Top priorities: RAG (92/100) and AI Evaluation (86/100).",
    details: { gap_count: 5, primary_gap: "RAG" },
    timestamp: "8 mins ago"
  },
  {
    id: "log_4",
    user_id: DEMO_USER_ID,
    agent_name: "Planner Agent",
    action_type: "curriculum_generated",
    message: "Synthesized 4-week structured learning roadmap with 12 sequenced activities.",
    details: { weekly_hours: 10, total_weeks: 4 },
    timestamp: "7 mins ago"
  },
  {
    id: "log_5",
    user_id: DEMO_USER_ID,
    agent_name: "Resource Agent",
    action_type: "materials_curated",
    message: "Curated 12 industry-standard resources from Sentence Transformers, Pinecone, and TruLens.",
    details: { resource_count: 12, types: ["documentation", "paper", "tutorial"] },
    timestamp: "6 mins ago"
  },
  {
    id: "log_6",
    user_id: DEMO_USER_ID,
    agent_name: "Adaptive Replanning Agent",
    action_type: "loop_active",
    message: "Monitoring learner trajectory. Ready to dynamically restructure curriculum upon assessment triggers.",
    details: { threshold_score: 70, mode: "closed_loop" },
    timestamp: "Just now"
  }
];

export const MOCK_PROGRESS_REPORT: ProgressReport = {
  title: "EduPath Periodic Learning Progress Report",
  date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  skills_acquired: ["Python", "FastAPI", "REST APIs"],
  skills_in_progress: ["RAG", "Machine Learning", "LLM APIs"],
  remaining_gaps: ["AI Evaluation", "MLOps", "Agentic AI"],
  recent_improvement: {
    skill: "RAG",
    trajectory: "42% → 58% (Developing)",
    assessment_score: 58
  },
  recommendations: [
    "Complete the newly inserted Retrieval Evaluation Practice.",
    "Review sentence boundary preservation in chunking strategies.",
    "Reinforce ChromaDB indexing before attempting multi-agent tool orchestrations."
  ],
  ai_summary: "The learner demonstrates strong backend engineering and API fundamentals. Recent practice highlighted specific opportunities in retrieval metric benchmarking. The curriculum has been automatically adapted with prerequisite exercises to ensure rock-solid foundational grounding."
};

export const MOCK_DASHBOARD_DATA: DashboardData = {
  user: MOCK_USER,
  skills: MOCK_SKILLS,
  top_gaps: MOCK_GAPS.slice(0, 3),
  all_gaps: MOCK_GAPS,
  persistent_struggles: [
    {
      skill_name: "RAG",
      scores: [42, 58],
      message: "Score below 70 threshold. Prerequisite drill automatically scheduled."
    }
  ],
  capability_matrix: MOCK_CAPABILITY_MATRIX,
  skill_coverage: {
    percentage: 68,
    developed_count: 8,
    total_count: 13,
    label: "68% Capability Match for Generative AI Engineer"
  },
  roadmap: MOCK_ROADMAP,
  activities: MOCK_ACTIVITIES,
  next_best_action: {
    title: "Document Ingestion & Chunking Strategies",
    skill_name: "RAG",
    duration_min: 75,
    reason: "Direct prerequisite for upcoming Vector Store hands-on sandbox."
  },
  progress_metric: {
    completed_tasks: 1,
    total_tasks: 12,
    current_week: 1
  }
};
