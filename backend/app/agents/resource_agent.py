from typing import Dict, List, Any, Optional

CURATED_RESOURCES: Dict[str, List[Dict[str, Any]]] = {
    "RAG": [
        {
            "title": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
            "format": "Article / Paper",
            "difficulty": "Intermediate",
            "estimated_time": "30 min",
            "url": "https://arxiv.org/abs/2005.11401",
            "why_recommended": "The seminal paper establishing the RAG architecture; essential for understanding context grounding vs parametric memory."
        },
        {
            "title": "Pinecone Learning Center: Retrieval-Augmented Generation (RAG)",
            "format": "Tutorial",
            "difficulty": "Beginner",
            "estimated_time": "35 min",
            "url": "https://www.pinecone.io/learn/retrieval-augmented-generation/",
            "why_recommended": "Clear, visual walk-through of the end-to-end retrieval and vector database pipeline."
        },
        {
            "title": "LangChain Documentation: Question Answering with RAG",
            "format": "Documentation",
            "difficulty": "Intermediate",
            "estimated_time": "40 min",
            "url": "https://python.langchain.com/docs/tutorials/rag/",
            "why_recommended": "Standard hands-on implementation guide for document loaders, text splitters, and vector stores in Python."
        }
    ],
    "AI Evaluation": [
        {
            "title": "Ragas: Evaluation Framework for RAG Pipelines",
            "format": "Documentation",
            "difficulty": "Intermediate",
            "estimated_time": "35 min",
            "url": "https://docs.ragas.io/",
            "why_recommended": "Essential industry tool for measuring context precision, context recall, and faithfulness."
        },
        {
            "title": "TruLens Documentation: Evaluating LLM Applications",
            "format": "Tutorial",
            "difficulty": "Intermediate",
            "estimated_time": "40 min",
            "url": "https://www.trulens.org/",
            "why_recommended": "Learn how to detect hallucinations and measure the RAG Triad."
        }
    ],
    "Vector Databases": [
        {
            "title": "ChromaDB Official Quickstart Guide",
            "format": "Documentation",
            "difficulty": "Beginner",
            "estimated_time": "25 min",
            "url": "https://docs.trychroma.com/getting-started",
            "why_recommended": "Fastest way to spin up an in-memory vector store for embedding collections."
        },
        {
            "title": "Qdrant Vector Database Documentation",
            "format": "Documentation",
            "difficulty": "Intermediate",
            "estimated_time": "35 min",
            "url": "https://qdrant.tech/documentation/",
            "why_recommended": "Production-grade HNSW indexing and payload filtering."
        }
    ],
    "Agentic AI": [
        {
            "title": "LangGraph: Multi-Agent Workflows",
            "format": "Tutorial",
            "difficulty": "Advanced",
            "estimated_time": "50 min",
            "url": "https://langchain-ai.github.io/langgraph/",
            "why_recommended": "Teaches cyclical graphs, state persistence, and human-in-the-loop control for complex agents."
        }
    ],
    "MLOps": [
        {
            "title": "Full Stack LLM BootCamp Resources",
            "format": "Guide",
            "difficulty": "Intermediate",
            "estimated_time": "45 min",
            "url": "https://fullstackdeeplearning.com/llm-bootcamp/",
            "why_recommended": "End-to-end guidance on serving, caching, and monitoring production LLM workloads."
        }
    ],
    "Python": [
        {
            "title": "Official Python Documentation & Asyncio",
            "format": "Documentation",
            "difficulty": "Intermediate",
            "estimated_time": "30 min",
            "url": "https://docs.python.org/3/library/asyncio.html",
            "why_recommended": "Crucial for writing non-blocking asynchronous GenAI services."
        }
    ]
}

class ResourceAgent:
    @staticmethod
    def get_resources_for_skill(skill_name: str, learner_level: str = "Beginner") -> List[Dict[str, Any]]:
        resources = CURATED_RESOURCES.get(skill_name, [])
        if not resources:
            # Check partial match
            for k, v in CURATED_RESOURCES.items():
                if k.lower() in skill_name.lower() or skill_name.lower() in k.lower():
                    resources = v
                    break
        
        if not resources:
            # Safe default real resource
            return [
                {
                    "title": f"Hugging Face Learn: {skill_name} Fundamentals",
                    "format": "Tutorial",
                    "difficulty": learner_level,
                    "estimated_time": "35 min",
                    "url": "https://huggingface.co/learn",
                    "why_recommended": f"Recommended to build practical foundations for {skill_name} before advanced application design."
                }
            ]
        return resources

resource_agent = ResourceAgent()
