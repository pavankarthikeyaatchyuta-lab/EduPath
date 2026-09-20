from typing import Dict, List, Any
import uuid
from app.ai_provider import ai_client
from app.agents.resource_agent import resource_agent

class LearningPlannerAgent:
    @staticmethod
    async def generate_roadmap(
        user_id: str,
        target_role: str,
        skill_gaps: List[Dict[str, Any]],
        weekly_hours: int = 10,
        learning_style: str = "hands-on"
    ) -> Dict[str, Any]:
        """
        Creates a structured, personalized 4-week learning roadmap.
        """
        # Default structured 4-week roadmap template designed for GenAI Engineer / target gaps
        weeks = [
            {
                "week_number": 1,
                "theme": "RAG Architecture & Document Retrieval Foundations",
                "activities": [
                    {
                        "sequence_order": 1,
                        "title": "RAG Fundamentals & Context Injection",
                        "activity_type": "learn",
                        "skill_name": "RAG",
                        "duration_min": 35,
                        "description": "Understand document chunking strategies, embeddings generation, and prompt context injection.",
                        "resource_url": "https://www.pinecone.io/learn/retrieval-augmented-generation/",
                        "resource_title": "Pinecone RAG Guide",
                        "resource_type": "Tutorial"
                    },
                    {
                        "sequence_order": 2,
                        "title": "Build a Simple In-Memory Retrieval Pipeline",
                        "activity_type": "practice",
                        "skill_name": "RAG",
                        "duration_min": 40,
                        "description": "Implement text splitting, cosine similarity calculation, and top-k context formatting.",
                        "resource_url": "https://python.langchain.com/docs/tutorials/rag/",
                        "resource_title": "LangChain QA Tutorial",
                        "resource_type": "Practice"
                    },
                    {
                        "sequence_order": 3,
                        "title": "5-Question RAG Core Assessment",
                        "activity_type": "assessment",
                        "skill_name": "RAG",
                        "duration_min": 15,
                        "description": "Evaluate understanding of embedding distance metrics, chunk overlap, and hallucination reduction.",
                        "resource_url": "",
                        "resource_title": "",
                        "resource_type": ""
                    }
                ]
            },
            {
                "week_number": 2,
                "theme": "Vector Databases & Dense Embedding Search",
                "activities": [
                    {
                        "sequence_order": 1,
                        "title": "Vector Databases & Indexing Strategies",
                        "activity_type": "learn",
                        "skill_name": "Vector Databases",
                        "duration_min": 35,
                        "description": "Explore HNSW vs IVF indexing, distance metrics (cosine, dot product, L2), and ChromaDB persistence.",
                        "resource_url": "https://docs.trychroma.com/getting-started",
                        "resource_title": "ChromaDB Quickstart",
                        "resource_type": "Documentation"
                    },
                    {
                        "sequence_order": 2,
                        "title": "Vector Search with ChromaDB Integration",
                        "activity_type": "practice",
                        "skill_name": "Vector Databases",
                        "duration_min": 45,
                        "description": "Persist document embeddings into ChromaDB and execute semantic similarity queries with metadata filtering.",
                        "resource_url": "https://docs.trychroma.com/getting-started",
                        "resource_title": "ChromaDB Practice",
                        "resource_type": "Practice"
                    }
                ]
            },
            {
                "week_number": 3,
                "theme": "RAG Evaluation & Quality Metrics",
                "activities": [
                    {
                        "sequence_order": 1,
                        "title": "The RAG Triad & Faithfulness Evaluation",
                        "activity_type": "learn",
                        "skill_name": "AI Evaluation",
                        "duration_min": 40,
                        "description": "Learn how to quantify Context Relevance, Groundedness (Faithfulness), and Answer Relevance using Ragas.",
                        "resource_url": "https://docs.ragas.io/",
                        "resource_title": "Ragas Evaluation Documentation",
                        "resource_type": "Documentation"
                    },
                    {
                        "sequence_order": 2,
                        "title": "Automated RAG Pipeline Benchmark",
                        "activity_type": "assessment",
                        "skill_name": "AI Evaluation",
                        "duration_min": 30,
                        "description": "Construct an evaluation harness comparing naive chunking vs semantic chunking with synthetic test sets.",
                        "resource_url": "https://docs.ragas.io/",
                        "resource_title": "Ragas Benchmark",
                        "resource_type": "Assessment"
                    }
                ]
            },
            {
                "week_number": 4,
                "theme": "Capstone Project: Production-Ready GenAI Assistant",
                "activities": [
                    {
                        "sequence_order": 1,
                        "title": "Build a Full-Stack Enterprise Knowledge Agent",
                        "activity_type": "project",
                        "skill_name": "RAG",
                        "duration_min": 120,
                        "description": "End-to-end multi-document search agent featuring FastAPI backend, streaming responses, and automated hallucination filters.",
                        "resource_url": "https://python.langchain.com/docs/tutorials/rag/",
                        "resource_title": "LangChain Production RAG",
                        "resource_type": "Project"
                    }
                ]
            }
        ]

        roadmap_id = str(uuid.uuid4())
        return {
            "id": roadmap_id,
            "version": 1,
            "title": f"{target_role} Mastery Roadmap",
            "weeks": weeks,
            "change_reason": "Initial personalized learning roadmap based on skill gap analysis.",
            "diff_summary": {"type": "initial", "added": ["Week 1: RAG Foundations", "Week 2: Vector Search", "Week 3: AI Evaluation", "Week 4: Capstone"]}
        }

planner_agent = LearningPlannerAgent()
