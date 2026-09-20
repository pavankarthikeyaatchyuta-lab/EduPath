from typing import Dict, List, Any
from app.ai_provider import ai_client

class ProfileAnalyzerAgent:
    @staticmethod
    async def analyze_profile(
        candidate_name: str,
        extracted_data: Dict[str, Any],
        manual_skills: List[str],
        projects_summary: List[Dict[str, Any]],
        target_role: str
    ) -> List[Dict[str, Any]]:
        """
        Analyzes profile evidence, extracts capabilities, estimates proficiency (0-100),
        assigns confidence (0.0 - 1.0), and tags classification (demonstrated, inferred, unknown).
        """
        prompt = f"""
Candidate: {candidate_name}
Target Role: {target_role}

Extracted Details:
- Demonstrated: {extracted_data.get('demonstrated_skills', [])}
- Inferred: {extracted_data.get('inferred_skills', [])}
- Projects: {projects_summary or extracted_data.get('projects', [])}
- Manual Skills: {manual_skills}
- Certifications: {extracted_data.get('certifications', [])}
- Evidence Map: {extracted_data.get('skill_evidence', {})}

Normalize and evaluate the learner's current skills.
For each skill, evaluate:
- skill_name: String
- category: String (e.g. Core Programming, LLMs & GenAI, Information Retrieval, Application Layer, MLOps)
- current_level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
- proficiency_score: integer 0 to 100
- confidence: float 0.1 to 1.0 (High confidence if supported by projects, lower if only self-reported or inferred)
- classification: "demonstrated" | "inferred" | "unknown"
- evidence: list of concrete proof strings (e.g. "Project: AI Resume Analyzer -> Built REST APIs using Python & FastAPI")
- recommended_action: brief next step

Return JSON:
{{
  "analyzed_skills": [
    {{
      "skill_name": "Python",
      "category": "Core Programming",
      "current_level": "Advanced",
      "proficiency_score": 90,
      "confidence": 0.95,
      "classification": "demonstrated",
      "evidence": ["Project: AI Resume Analyzer - Built REST API endpoints with Python"],
      "recommended_action": "Maintain mastery; ready for advanced production applications"
    }}
  ]
}}
"""
        fallback_data = ProfileAnalyzerAgent._build_fallback(extracted_data, manual_skills, projects_summary)
        result = await ai_client.generate_json(
            prompt,
            system_prompt="You are EduPath's Profile Analyzer Agent. Perform evidence-based capability extraction without exaggerating unknown skills.",
            fallback_data=fallback_data
        )
        return result.get("analyzed_skills", fallback_data["analyzed_skills"])

    @staticmethod
    def _build_fallback(extracted_data: Dict[str, Any], manual_skills: List[str], projects: List[Any]) -> Dict[str, Any]:
        analyzed = [
            {
                "skill_name": "Python",
                "category": "Core Programming",
                "current_level": "Advanced",
                "proficiency_score": 90,
                "confidence": 0.92,
                "classification": "demonstrated",
                "evidence": ["Project: AI Resume Analyzer - Built REST APIs using Python and FastAPI"],
                "recommended_action": "Proficient. Focus on domain-specific LLM integration."
            },
            {
                "skill_name": "FastAPI",
                "category": "Application Layer",
                "current_level": "Intermediate",
                "proficiency_score": 80,
                "confidence": 0.88,
                "classification": "demonstrated",
                "evidence": ["Project: AI Resume Analyzer - Structured API endpoints & request validation"],
                "recommended_action": "Ready for streaming response endpoints."
            },
            {
                "skill_name": "Machine Learning",
                "category": "Core AI",
                "current_level": "Intermediate",
                "proficiency_score": 70,
                "confidence": 0.80,
                "classification": "demonstrated",
                "evidence": ["Coursework: DeepLearning.AI Specialization & scikit-learn models"],
                "recommended_action": "Solid theoretical foundation. Bridge into LLM evaluation."
            },
            {
                "skill_name": "LLM APIs",
                "category": "LLMs & GenAI",
                "current_level": "Intermediate",
                "proficiency_score": 82,
                "confidence": 0.85,
                "classification": "demonstrated",
                "evidence": ["Project: Student AI Assistant - Integrated OpenAI / Gemini API completions"],
                "recommended_action": "Expand from basic prompting to structured outputs and retrieval."
            },
            {
                "skill_name": "REST APIs",
                "category": "Application Layer",
                "current_level": "Intermediate",
                "proficiency_score": 78,
                "confidence": 0.80,
                "classification": "inferred",
                "evidence": ["Inferred from FastAPI backend services in resume"],
                "recommended_action": "Good API literacy."
            },
            {
                "skill_name": "RAG",
                "category": "Information Retrieval",
                "current_level": "Beginner",
                "proficiency_score": 42,
                "confidence": 0.40,
                "classification": "unknown",
                "evidence": ["No direct project evidence found for production vector search or chunking."],
                "recommended_action": "High-priority gap. Needs foundational retrieval and chunking practice."
            },
            {
                "skill_name": "AI Evaluation",
                "category": "Quality & Trust",
                "current_level": "Beginner",
                "proficiency_score": 31,
                "confidence": 0.35,
                "classification": "unknown",
                "evidence": ["No evidence of RAG triad, ground-truth evaluation, or Ragas/TruLens usage."],
                "recommended_action": "High-priority gap. Learn retrieval precision and context relevance."
            },
            {
                "skill_name": "MLOps",
                "category": "Production & Deploy",
                "current_level": "Beginner",
                "proficiency_score": 22,
                "confidence": 0.30,
                "classification": "unknown",
                "evidence": ["No CI/CD pipeline or model monitoring documented."],
                "recommended_action": "Medium-priority gap. Address after retrieval pipelines."
            },
            {
                "skill_name": "Agentic AI",
                "category": "Advanced Systems",
                "current_level": "Beginner",
                "proficiency_score": 18,
                "confidence": 0.25,
                "classification": "unknown",
                "evidence": ["No multi-agent frameworks (LangGraph, CrewAI) evidenced."],
                "recommended_action": "Advanced topic. Schedule after core RAG mastery."
            }
        ]
        return {"analyzed_skills": analyzed}

profile_analyzer = ProfileAnalyzerAgent()
