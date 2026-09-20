import uuid
import json
from datetime import datetime, timezone
from app.database import db_session, log_agent_activity

DEMO_USER_ID = "demo_alex_rivera"

def seed_demo_data(force_reset: bool = True):
    """
    Seeds deterministic demo data for 'Alex Rivera', aspiring Generative AI Engineer.
    """
    now_str = datetime.now(timezone.utc).isoformat()
    with db_session() as conn:
        cursor = conn.cursor()

        if force_reset:
            cursor.execute("DELETE FROM roadmap_activities WHERE user_id = ?", (DEMO_USER_ID,))
            cursor.execute("DELETE FROM roadmaps WHERE user_id = ?", (DEMO_USER_ID,))
            cursor.execute("DELETE FROM skill_gaps WHERE user_id = ?", (DEMO_USER_ID,))
            cursor.execute("DELETE FROM skills WHERE user_id = ?", (DEMO_USER_ID,))
            cursor.execute("DELETE FROM profiles WHERE user_id = ?", (DEMO_USER_ID,))
            cursor.execute("DELETE FROM practice_tasks WHERE user_id = ?", (DEMO_USER_ID,))
            cursor.execute("DELETE FROM submissions WHERE user_id = ?", (DEMO_USER_ID,))
            cursor.execute("DELETE FROM agent_logs WHERE user_id = ?", (DEMO_USER_ID,))
            cursor.execute("DELETE FROM progress_reports WHERE user_id = ?", (DEMO_USER_ID,))
            cursor.execute("DELETE FROM users WHERE id = ?", (DEMO_USER_ID,))

        # 1. User
        cursor.execute(
            "INSERT OR REPLACE INTO users (id, name, email, created_at) VALUES (?, ?, ?, ?)",
            (DEMO_USER_ID, "Alex Rivera", "alex.rivera@example.com", now_str)
        )

        # 2. Profile
        manual_skills = ["Python", "FastAPI", "Machine Learning", "LLM APIs", "REST APIs", "SQL"]
        projects = [
            {
                "title": "AI Resume Analyzer",
                "description": "Engineered REST APIs with FastAPI to extract structured resume candidate data and score relevancy.",
                "technologies": ["Python", "FastAPI", "Machine Learning", "REST APIs"]
            },
            {
                "title": "Student Assistant Chatbot",
                "description": "Built campus FAQ bot using OpenAI API with prompt engineering and conversational memory.",
                "technologies": ["Python", "LLM APIs", "Prompt Engineering"]
            }
        ]
        cursor.execute(
            """INSERT OR REPLACE INTO profiles 
               (user_id, current_role, education, years_experience, target_role, career_goal, weekly_hours, learning_style, manual_skills, projects_summary, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                DEMO_USER_ID,
                "Junior AI Developer",
                "B.S. in Computer Science",
                2.0,
                "Generative AI Engineer",
                "Transition into building production-grade enterprise RAG and agentic AI systems.",
                10,
                "hands-on",
                json.dumps(manual_skills),
                json.dumps(projects),
                now_str
            )
        )

        # 3. Skills with Evidence & Confidence
        skills_seed = [
            ("Python", "Core Programming", "Advanced", "Advanced", 90, 0.95, "demonstrated", ["Resume: Built backend REST APIs for AI Resume Analyzer using Python."]),
            ("FastAPI", "Application Layer", "Intermediate", "Advanced", 80, 0.88, "demonstrated", ["Resume: Developed high-throughput asynchronous REST endpoints with Pydantic validation."]),
            ("Machine Learning", "Core AI", "Intermediate", "Advanced", 70, 0.80, "demonstrated", ["DeepLearning.AI Specialization certificate; built supervised classification models."]),
            ("Deep Learning", "Core AI", "Intermediate", "Advanced", 68, 0.75, "inferred", ["Inferred from DeepLearning.AI Specialization coursework and neural network models."]),
            ("LLM APIs", "LLMs & GenAI", "Intermediate", "Advanced", 82, 0.85, "demonstrated", ["Project: Student Assistant Chatbot integrated with OpenAI and Gemini API."]),
            ("Prompt Engineering", "LLMs & GenAI", "Intermediate", "Advanced", 78, 0.85, "demonstrated", ["Project: Engineered system prompts, few-shot templates, and conversational memory in Student Assistant Chatbot."]),
            ("REST APIs", "Application Layer", "Intermediate", "Advanced", 78, 0.82, "inferred", ["Inferred from production FastAPI services in resume."]),
            ("SQL", "Data Engineering", "Intermediate", "Intermediate", 75, 0.78, "demonstrated", ["PostgreSQL relational schemas for user session management."]),
            ("Vector Databases", "Information Retrieval", "Beginner", "Advanced", 38, 0.35, "unknown", ["No direct project evidence found for Pinecone, Chroma, or dense index querying."]),
            ("RAG", "Information Retrieval", "Beginner", "Advanced", 42, 0.40, "unknown", ["No direct project evidence found for chunking, vector embeddings, or dense retrieval."]),
            ("AI Evaluation", "Quality & Trust", "Beginner", "Advanced", 31, 0.35, "unknown", ["No evidence of RAG triad benchmarks, hallucination detection, or Ragas."]),
            ("MLOps", "Production & Deploy", "Beginner", "Intermediate", 22, 0.30, "unknown", ["No CI/CD pipeline or model monitoring documented."]),
            ("Agentic AI", "Advanced Systems", "Beginner", "Advanced", 18, 0.25, "unknown", ["No multi-agent frameworks (LangGraph, CrewAI) evidenced."])
        ]

        for s_name, cat, c_lvl, t_lvl, prof, conf, cls, ev in skills_seed:
            cursor.execute(
                """INSERT OR REPLACE INTO skills 
                   (id, user_id, skill_name, category, current_level, target_level, proficiency_score, confidence, classification, evidence, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (f"{DEMO_USER_ID}_{s_name}", DEMO_USER_ID, s_name, cat, c_lvl, t_lvl, prof, conf, cls, json.dumps(ev), now_str)
            )

        # 4. Skill Gaps
        gaps_seed = [
            ("RAG", "Information Retrieval", "Beginner", "Advanced", "high", "high", 92,
             "Your profile demonstrates LLM API usage but lacks evidence of document chunking, embeddings, and retrieval pipelines.",
             "Master RAG core principles, vector stores, and prompt context injection."),
            ("AI Evaluation", "Quality & Trust", "Beginner", "Advanced", "high", "high", 86,
             "Target role requires automated evaluation (RAG triad, faithfulness, latency benchmarks), not yet in your portfolio.",
             "Learn Ragas and TruLens to benchmark retrieval context and answer groundedness."),
            ("MLOps", "Production & Deploy", "Beginner", "Intermediate", "medium", "medium", 64,
             "Enterprise AI roles require containerized model serving and latency monitoring.",
             "Deploy containerized LLM endpoints with observability."),
            ("Agentic AI", "Advanced Systems", "Beginner", "Advanced", "medium", "medium", 58,
             "Multi-step reasoning and tool-calling agent architectures are critical for the target role.",
             "Build cyclic tool-calling agents using LangGraph.")
        ]

        for s_name, cat, c_lvl, t_lvl, sev, prio, score, reason, obj in gaps_seed:
            cursor.execute(
                """INSERT OR REPLACE INTO skill_gaps 
                   (id, user_id, skill_name, category, current_level, target_level, gap_severity, priority, priority_score, reason, recommended_objective)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (f"{DEMO_USER_ID}_{s_name}", DEMO_USER_ID, s_name, cat, c_lvl, t_lvl, sev, prio, score, reason, obj)
            )

        # 5. Roadmap Version 1
        roadmap_v1_id = f"{DEMO_USER_ID}_roadmap_v1"
        cursor.execute(
            """INSERT OR REPLACE INTO roadmaps (id, user_id, version, title, is_active, change_reason, diff_summary, created_at)
               VALUES (?, ?, 1, 'Generative AI Engineer Mastery Roadmap', 1, 'Initial personalized roadmap based on evidence extraction and skill gaps.', ?, ?)""",
            (
                roadmap_v1_id,
                DEMO_USER_ID,
                json.dumps({"type": "initial", "added": ["Week 1: RAG Foundations", "Week 2: Vector Databases", "Week 3: AI Evaluation", "Week 4: Capstone"]}),
                now_str
            )
        )

        activities_v1 = [
            # Week 1
            (1, 1, "RAG Fundamentals & Context Injection", "learn", "RAG", 35,
             "Understand document chunking strategies, embeddings generation, and prompt context injection.",
             "completed", 0, 0, 85, "https://www.pinecone.io/learn/retrieval-augmented-generation/", "Pinecone RAG Guide", "Tutorial"),
            (1, 2, "Build a Simple In-Memory Retrieval Pipeline", "practice", "RAG", 40,
             "Implement text splitting, cosine similarity calculation, and top-k context formatting.",
             "completed", 0, 0, 80, "https://python.langchain.com/docs/tutorials/rag/", "LangChain QA Tutorial", "Practice"),
            (1, 3, "Build a Simple Document Q&A Pipeline (Assessment)", "assessment", "RAG", 20,
             "Evaluate understanding of retrieval quality, context formatting, and sentence boundaries.",
             "pending", 0, 0, None, "", "", ""),
            # Week 2
            (2, 1, "Vector Databases & Indexing Strategies", "learn", "Vector Databases", 35,
             "Explore HNSW indexing, distance metrics, and ChromaDB persistence.",
             "pending", 0, 0, None, "https://docs.trychroma.com/getting-started", "ChromaDB Quickstart", "Documentation"),
            (2, 2, "ChromaDB Persistent Semantic Search", "practice", "Vector Databases", 45,
             "Persist document embeddings and execute similarity queries with metadata filters.",
             "pending", 0, 0, None, "https://docs.trychroma.com/getting-started", "ChromaDB Practice", "Practice"),
            # Week 3
            (3, 1, "The RAG Triad & Faithfulness Evaluation", "learn", "AI Evaluation", 40,
             "Learn how to quantify Context Relevance, Groundedness, and Answer Relevance using Ragas.",
             "pending", 0, 0, None, "https://docs.ragas.io/", "Ragas Documentation", "Documentation"),
            # Week 4
            (4, 1, "Capstone: Full-Stack Enterprise Knowledge Agent", "project", "RAG", 120,
             "Build a multi-document search agent featuring FastAPI, streaming responses, and hallucination filters.",
             "pending", 0, 0, None, "https://python.langchain.com/docs/tutorials/rag/", "Production RAG", "Project")
        ]

        for w_num, seq, title, act_type, s_name, dur, desc, status, is_new, is_mov, score, r_url, r_title, r_type in activities_v1:
            cursor.execute(
                """INSERT OR REPLACE INTO roadmap_activities 
                   (id, roadmap_id, user_id, week_number, sequence_order, title, activity_type, skill_name, duration_min, description, status, is_new_addition, is_moved, score, resource_url, resource_title, resource_type)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (str(uuid.uuid4()), roadmap_v1_id, DEMO_USER_ID, w_num, seq, title, act_type, s_name, dur, desc, status, is_new, is_mov, score, r_url, r_title, r_type)
            )

        # 6. Practice Task Seed
        task_id = f"{DEMO_USER_ID}_task_rag"
        cursor.execute(
            """INSERT OR REPLACE INTO practice_tasks 
               (id, user_id, skill_name, task_title, practice_type, objective, requirements, evaluation_criteria, initial_code_template, difficulty)
               VALUES (?, ?, 'RAG', 'Build a Simple Document Q&A Pipeline', 'coding', ?, ?, ?, ?, 'Intermediate')""",
            (
                task_id,
                DEMO_USER_ID,
                "Understand document chunking, similarity search retrieval, and prompt context injection.",
                json.dumps([
                    "1. Document Ingestion: Load and parse text documents into discrete passages.",
                    "2. Chunking & Overlap: Split text into token chunks with overlap.",
                    "3. Embeddings & Index: Compute cosine similarity or token overlap scores.",
                    "4. Top-K Retrieval: Retrieve top 2 most relevant passages.",
                    "5. Context Grounding: Format prompt injecting retrieved context."
                ]),
                json.dumps([
                    "Retrieval Correctness: Does the search rank relevant passages accurately?",
                    "Context Relevance: Does it isolate only relevant passages without extraneous text?",
                    "Explanation & Edge Cases: Does it handle empty or missing context gracefully?"
                ]),
                '''# Practice: Simple Document Q&A Retrieval Pipeline
from typing import List

class SimpleRAG:
    def __init__(self, documents: List[str]):
        self.documents = documents

    def retrieve(self, query: str, top_k: int = 2) -> List[str]:
        # Basic keyword match implementation
        query_words = set(query.lower().split())
        scored = []
        for doc in self.documents:
            words = set(doc.lower().split())
            score = len(query_words.intersection(words))
            scored.append((score, doc))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [doc for score, doc in scored[:top_k]]

    def answer_query(self, query: str) -> str:
        context = "\\n".join(self.retrieve(query))
        return f"Context:\\n{context}\\n\\nQuestion: {query}\\nAnswer:"

# Test
docs = [
    "EduPath AI uses adaptive multi-agent workflows to personalize learning paths.",
    "Traditional curricula are static and fail to adjust to learner mistakes.",
    "The evaluation agent scores submissions and triggers roadmap replanning."
]
rag = SimpleRAG(docs)
print(rag.answer_query("How does EduPath handle learner mistakes?"))
'''
            )
        )

        # 7. Initial Agent Logs within same connection
        log_agent_activity(DEMO_USER_ID, "Profile Analyzer", "PROFILE_ANALYZED", "Extracted 6 demonstrated skills and 4 unverified capabilities from resume and projects.", {"skills_count": 10}, conn=conn)
        log_agent_activity(DEMO_USER_ID, "Target Role Analyzer", "ROLE_MAPPED", "Mapped Generative AI Engineer role to 12 critical capabilities.", {"target_role": "Generative AI Engineer"}, conn=conn)
        log_agent_activity(DEMO_USER_ID, "Skill Gap Agent", "GAPS_IDENTIFIED", "Identified 4 prioritized skill gaps; RAG prioritized as #1 target gap.", {"top_gap": "RAG", "coverage": 68}, conn=conn)
        log_agent_activity(DEMO_USER_ID, "Learning Planner", "ROADMAP_CREATED", "Generated personalized 4-week roadmap v1 for Alex Rivera.", {"weeks": 4}, conn=conn)

    return DEMO_USER_ID
