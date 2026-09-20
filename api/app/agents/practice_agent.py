from typing import Dict, List, Any, Optional
import uuid
from app.ai_provider import ai_client

DEFAULT_PRACTICE_TASKS = {
    "RAG": {
        "task_title": "Build a Simple Document Q&A Pipeline",
        "practice_type": "coding",
        "difficulty": "Intermediate",
        "objective": "Understand document chunking, similarity search retrieval, and prompt context injection.",
        "requirements": [
            "1. Document Ingestion: Load and parse text documents into discrete passages.",
            "2. Chunking & Overlap: Split text into manageable token chunks with 10-20% overlap.",
            "3. Embeddings & Index: Generate vector embeddings or compute cosine similarity over query tokens.",
            "4. Top-K Retrieval: Retrieve top 2 most relevant passages based on query similarity.",
            "5. Context Grounding: Format prompt injecting retrieved context to avoid hallucinations."
        ],
        "evaluation_criteria": [
            "Retrieval Correctness: Does the implementation search and rank relevant chunks accurately?",
            "Context Relevance: Does it isolate only relevant passages rather than dumping whole documents?",
            "Explanation & Handling: Does the code handle empty query or missing context gracefully?"
        ],
        "initial_code_template": '''# Practice: Simple Document Q&A Retrieval Pipeline
from typing import List, Dict
import math

class SimpleRAG:
    def __init__(self, documents: List[str]):
        self.documents = documents
        self.chunks = []
        self._prepare_chunks()

    def _prepare_chunks(self):
        # TODO: Implement chunking logic with overlap
        pass

    def retrieve(self, query: str, top_k: int = 2) -> List[str]:
        # TODO: Implement retrieval logic (e.g. token overlap or cosine similarity)
        return []

    def answer_query(self, query: str) -> str:
        # TODO: Retrieve top chunks, inject into prompt, and synthesize answer
        context = self.retrieve(query)
        prompt = f"Context:\\n{context}\\n\\nQuestion: {query}\\nAnswer:"
        return prompt

# Test your implementation
docs = [
    "EduPath AI uses adaptive multi-agent workflows to personalize learning paths.",
    "Traditional curricula are static and fail to adjust to learner mistakes.",
    "The evaluation agent scores submissions and triggers roadmap replanning."
]
rag = SimpleRAG(docs)
print(rag.answer_query("How does EduPath handle learner mistakes?"))
'''
    }
}

class PracticeAgent:
    @staticmethod
    async def generate_task(
        user_id: str,
        skill_name: str,
        learner_level: str = "Beginner",
        target_role: str = "Generative AI Engineer"
    ) -> Dict[str, Any]:
        """
        Generates or retrieves a targeted practice task for the learner.
        """
        if skill_name in DEFAULT_PRACTICE_TASKS:
            task = DEFAULT_PRACTICE_TASKS[skill_name].copy()
            task["id"] = str(uuid.uuid4())
            task["user_id"] = user_id
            task["skill_name"] = skill_name
            return task

        # Dynamic generation via LLM if custom skill
        prompt = f"""
Create an interactive practice task for skill: '{skill_name}'
Learner Level: {learner_level}
Target Role: {target_role}

Format as JSON:
{{
  "task_title": "Practical Task Title",
  "practice_type": "coding",
  "difficulty": "Intermediate",
  "objective": "Clear learning objective",
  "requirements": ["Requirement 1", "Requirement 2", "Requirement 3"],
  "evaluation_criteria": ["Criteria 1", "Criteria 2"],
  "initial_code_template": "# Python template code..."
}}
"""
        fallback = {
            "task_title": f"{skill_name} Hands-on Implementation Task",
            "practice_type": "coding",
            "difficulty": "Intermediate",
            "objective": f"Apply core concepts of {skill_name} in a practical scenario.",
            "requirements": [
                f"1. Initialize the {skill_name} pipeline.",
                "2. Process input parameters and validate data types.",
                "3. Return expected output with proper error handling."
            ],
            "evaluation_criteria": ["Implementation correctness", "Edge case validation", "Code readability"],
            "initial_code_template": f"# Starter code for {skill_name}\\ndef run_task(input_data):\\n    pass\\n"
        }
        res = await ai_client.generate_json(
            prompt,
            system_prompt="You are EduPath's Practice Generation Agent. Create hands-on, educational programming exercises.",
            fallback_data=fallback
        )
        res["id"] = str(uuid.uuid4())
        res["user_id"] = user_id
        res["skill_name"] = skill_name
        return res

practice_agent = PracticeAgent()
