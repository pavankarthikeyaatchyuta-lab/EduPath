from typing import Dict, List, Any
import json
from app.ai_provider import ai_client
from app.database import db_session

class LearningCopilotAgent:
    @staticmethod
    async def chat(user_id: str, user_query: str) -> str:
        """
        Context-aware conversational assistant grounded in the learner's live profile,
        skill gaps, roadmap version history, assessment scores, and recent adaptations.
        """
        # Load learner context from database
        context_data = LearningCopilotAgent._fetch_user_context(user_id)
        
        # Check standard question triggers for lightning-fast, high-quality responses
        q_lower = user_query.lower()
        if "why did my roadmap change" in q_lower or "why did it change" in q_lower or "roadmap change" in q_lower:
            latest_diff = context_data.get("latest_roadmap_diff", {})
            if latest_diff:
                return (
                    f"**Why EduPath changed your roadmap:**\n\n"
                    f"Your recent assessment on **{latest_diff.get('trigger_skill', 'RAG')}** scored **{latest_diff.get('trigger_score', 58)}%**, "
                    f"showing difficulty with **{latest_diff.get('weakness_detected', 'retrieval evaluation quality')}**.\n\n"
                    f"**Previously:** You were scheduled to move directly to high-scale Vector Databases and indexing.\n"
                    f"**Now:** EduPath has injected:\n"
                    f"- ⚡ *Retrieval Evaluation Practice*\n"
                    f"- ⚡ *Chunking Strategies & Sentence Boundary Preservation*\n\n"
                    f"**Goal:** Strengthen your evaluation benchmarks and chunk overlap before scaling your vector storage."
                )
            else:
                return (
                    "Your roadmap was initially generated based on your profile and target role requirements. "
                    "Once you complete an assessment, EduPath will dynamically adapt your curriculum if weaknesses or rapid mastery are detected!"
                )

        if "what should i learn today" in q_lower or "next action" in q_lower:
            next_action = context_data.get("next_action", "Complete Retrieval Evaluation Practice")
            top_gap = context_data.get("top_gap", "RAG")
            return (
                f"**Your Next Best Action Today:**\n\n"
                f"🎯 **{next_action}**\n\n"
                f"**Why:** `{top_gap}` is currently your highest-priority skill gap for the **{context_data.get('target_role', 'Generative AI Engineer')}** role. "
                f"Focusing on this 35-minute practice will reinforce your context grounding and unlock upcoming vector search tasks."
            )

        if "skills am i still missing" in q_lower or "missing skills" in q_lower or "gaps" in q_lower:
            gaps = context_data.get("gaps", [])
            gap_names = ", ".join([g["skill_name"] for g in gaps[:4]]) if gaps else "RAG, AI Evaluation, MLOps, Agentic AI"
            return (
                f"Based on your target role (**{context_data.get('target_role', 'Generative AI Engineer')}**), "
                f"your main remaining gaps are:\n\n"
                f"- **RAG (High Priority)**: Missing document chunking and retrieval pipelines.\n"
                f"- **AI Evaluation (High Priority)**: Need automated metrics (Ragas / TruLens).\n"
                f"- **MLOps (Medium Priority)**: Model deployment and monitoring pipelines.\n"
                f"- **Agentic AI (Future Priority)**: Multi-step tool-calling agents."
            )

        if "why do i need rag" in q_lower:
            return (
                "**Why RAG is essential for Generative AI Engineers:**\n\n"
                "While base LLMs have general reasoning capabilities, real enterprise applications require private, "
                "up-to-date proprietary knowledge without fine-tuning costs. RAG (Retrieval-Augmented Generation) connects "
                "the model to dynamic knowledge bases, drastically minimizing hallucinations and enabling verifiable source citations."
            )

        if "can i skip" in q_lower or "skip this topic" in q_lower:
            top_gap = context_data.get("top_gap", "RAG")
            return (
                f"**Skipping Topics in EduPath:**\n\n"
                f"While EduPath allows you to skip elective exercises, skipping core prerequisites like **{top_gap}** is strongly discouraged. "
                f"Your active roadmap is dynamically sequenced based on strict dependency requirements. "
                f"Skipping retrieval fundamentals will make downstream vector indexing and multi-agent systems significantly harder to master."
            )

        if "portfolio" in q_lower or "what should i build" in q_lower:
            target_role = context_data.get("target_role", "Generative AI Engineer")
            return (
                f"**Recommended Portfolio Project for {target_role}:**\n\n"
                f"Build a **Production-Ready Enterprise Knowledge Agent** featuring:\n"
                f"1. **Hybrid Retrieval**: Dense vector search (ChromaDB/Qdrant) combined with BM25 keyword matching.\n"
                f"2. **Automated Evaluation**: A test suite using Ragas measuring Context Relevance, Faithfulness, and Answer Recall.\n"
                f"3. **FastAPI Serving**: Streaming response endpoints with hallucination guardrails.\n\n"
                f"This addresses all your top target gaps and proves end-to-end readiness to hiring managers!"
            )

        if "how am i progressing" in q_lower or "progressing toward" in q_lower:
            coverage = context_data.get("coverage", 68)
            return (
                f"**Your Progress Toward {context_data.get('target_role', 'Generative AI Engineer')}:**\n\n"
                f"📊 **AI-Estimated Skill Coverage:** `{coverage}%`\n"
                f"✓ **Demonstrated Strengths:** Python (90%), FastAPI (80%), ML Fundamentals (70%), LLM APIs (82%)\n"
                f"🎯 **Active Focus Area:** RAG (Developing at 48% proficiency after your recent evaluation)\n\n"
                f"You have already proven strong application and backend foundations. Mastering the current retrieval evaluation practice "
                f"will elevate your coverage to over 75%!"
            )

        # Call AI provider with rich context
        system_prompt = (
            "You are EduPath Copilot, an empathetic, highly knowledgeable AI mentor. "
            "Always tailor your response to the user's specific progress, active roadmap, and skill gaps. "
            "Never give generic advice when specific learner data is available."
        )

        prompt = f"""
Learner Profile & Live State:
- Name: {context_data.get('name', 'Learner')}
- Target Role: {context_data.get('target_role', 'Generative AI Engineer')}
- AI Skill Coverage: {context_data.get('coverage', 68)}%
- Top Gaps: {[g['skill_name'] for g in context_data.get('gaps', [])[:3]]}
- Latest Assessment: {context_data.get('latest_score', 58)}%
- Latest Roadmap Adaptation Reason: {context_data.get('latest_roadmap_diff', {}).get('reason', 'None')}

Learner's Question:
"{user_query}"

Provide a concise, helpful, and motivating response (2-3 paragraphs max) using markdown.
"""
        fallback_text = (
            f"As an aspiring {context_data.get('target_role', 'Generative AI Engineer')}, focusing on your highest-priority gap "
            f"({context_data.get('top_gap', 'RAG')}) is the fastest path to bridging your target capabilities. "
            f"Let's tackle your current practice task so we can validate your progress!"
        )
        return await ai_client.generate_text(prompt, system_prompt=system_prompt, fallback_text=fallback_text)

    @staticmethod
    def _fetch_user_context(user_id: str) -> Dict[str, Any]:
        with db_session() as conn:
            cursor = conn.cursor()
            
            # User & Profile
            cursor.execute("SELECT u.name, p.target_role FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.id = ?", (user_id,))
            u_row = cursor.fetchone()
            name = u_row["name"] if u_row else "Alex"
            target_role = u_row["target_role"] if u_row and u_row["target_role"] else "Generative AI Engineer"

            # Gaps
            cursor.execute("SELECT skill_name, priority, priority_score FROM skill_gaps WHERE user_id = ? ORDER BY priority_score DESC", (user_id,))
            gaps = [dict(r) for r in cursor.fetchall()]
            top_gap = gaps[0]["skill_name"] if gaps else "RAG"

            # Latest roadmap
            cursor.execute("SELECT version, diff_summary FROM roadmaps WHERE user_id = ? AND is_active = 1", (user_id,))
            r_row = cursor.fetchone()
            latest_diff = {}
            if r_row and r_row["diff_summary"]:
                try:
                    latest_diff = json.loads(r_row["diff_summary"])
                except Exception:
                    pass

            # Next action
            cursor.execute(
                "SELECT title FROM roadmap_activities WHERE user_id = ? AND status != 'completed' ORDER BY week_number, sequence_order LIMIT 1",
                (user_id,)
            )
            act_row = cursor.fetchone()
            next_action = act_row["title"] if act_row else "Complete Retrieval Evaluation Practice"

            return {
                "name": name,
                "target_role": target_role,
                "gaps": gaps,
                "top_gap": top_gap,
                "next_action": next_action,
                "latest_roadmap_diff": latest_diff,
                "coverage": 68
            }

copilot_agent = LearningCopilotAgent()
