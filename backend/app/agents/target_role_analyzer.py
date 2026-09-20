from typing import Dict, List, Any
from app.ai_provider import ai_client

PREDEFINED_ROLES: Dict[str, List[Dict[str, Any]]] = {
    "Generative AI Engineer": [
        {"skill": "Python", "importance": "Critical", "expected_proficiency": 85, "category": "Core Programming"},
        {"skill": "Machine Learning", "importance": "Critical", "expected_proficiency": 80, "category": "Core AI"},
        {"skill": "Deep Learning", "importance": "High", "expected_proficiency": 75, "category": "Core AI"},
        {"skill": "LLM APIs", "importance": "Critical", "expected_proficiency": 85, "category": "LLMs & GenAI"},
        {"skill": "Prompt Engineering", "importance": "High", "expected_proficiency": 80, "category": "LLMs & GenAI"},
        {"skill": "RAG", "importance": "Critical", "expected_proficiency": 85, "category": "Information Retrieval"},
        {"skill": "Vector Databases", "importance": "High", "expected_proficiency": 80, "category": "Information Retrieval"},
        {"skill": "AI Evaluation", "importance": "High", "expected_proficiency": 75, "category": "Quality & Trust"},
        {"skill": "Agentic AI", "importance": "High", "expected_proficiency": 75, "category": "Advanced Systems"},
        {"skill": "FastAPI", "importance": "Medium", "expected_proficiency": 75, "category": "Application Layer"},
        {"skill": "REST APIs", "importance": "High", "expected_proficiency": 80, "category": "Application Layer"},
        {"skill": "MLOps", "importance": "Medium", "expected_proficiency": 70, "category": "Production & Deploy"}
    ],
    "Machine Learning Engineer": [
        {"skill": "Python", "importance": "Critical", "expected_proficiency": 90, "category": "Core Programming"},
        {"skill": "Machine Learning", "importance": "Critical", "expected_proficiency": 90, "category": "Core AI"},
        {"skill": "Deep Learning", "importance": "High", "expected_proficiency": 85, "category": "Core AI"},
        {"skill": "MLOps", "importance": "Critical", "expected_proficiency": 85, "category": "Production & Deploy"},
        {"skill": "SQL", "importance": "High", "expected_proficiency": 80, "category": "Data Engineering"},
        {"skill": "Data Pipelines", "importance": "High", "expected_proficiency": 80, "category": "Data Engineering"},
        {"skill": "Model Serving", "importance": "High", "expected_proficiency": 80, "category": "Production & Deploy"},
        {"skill": "Docker", "importance": "Medium", "expected_proficiency": 75, "category": "Infrastructure"}
    ],
    "Data Scientist": [
        {"skill": "Python", "importance": "Critical", "expected_proficiency": 85, "category": "Core Programming"},
        {"skill": "SQL", "importance": "Critical", "expected_proficiency": 90, "category": "Data Engineering"},
        {"skill": "Statistical Analysis", "importance": "Critical", "expected_proficiency": 85, "category": "Core AI"},
        {"skill": "Machine Learning", "importance": "High", "expected_proficiency": 80, "category": "Core AI"},
        {"skill": "Data Visualization", "importance": "High", "expected_proficiency": 85, "category": "Communication"},
        {"skill": "Feature Engineering", "importance": "High", "expected_proficiency": 80, "category": "Core AI"}
    ],
    "Backend Developer": [
        {"skill": "Python", "importance": "Critical", "expected_proficiency": 90, "category": "Core Programming"},
        {"skill": "FastAPI", "importance": "High", "expected_proficiency": 85, "category": "Application Layer"},
        {"skill": "REST APIs", "importance": "Critical", "expected_proficiency": 90, "category": "Application Layer"},
        {"skill": "SQL", "importance": "Critical", "expected_proficiency": 85, "category": "Data Engineering"},
        {"skill": "System Design", "importance": "High", "expected_proficiency": 80, "category": "Architecture"},
        {"skill": "Docker", "importance": "Medium", "expected_proficiency": 75, "category": "Infrastructure"}
    ],
    "Full Stack Developer": [
        {"skill": "JavaScript/TypeScript", "importance": "Critical", "expected_proficiency": 85, "category": "Core Programming"},
        {"skill": "React", "importance": "Critical", "expected_proficiency": 85, "category": "Frontend"},
        {"skill": "Python", "importance": "High", "expected_proficiency": 80, "category": "Core Programming"},
        {"skill": "REST APIs", "importance": "Critical", "expected_proficiency": 85, "category": "Application Layer"},
        {"skill": "SQL", "importance": "High", "expected_proficiency": 80, "category": "Data Engineering"},
        {"skill": "HTML & CSS", "importance": "High", "expected_proficiency": 85, "category": "Frontend"}
    ],
    "AI Product Engineer": [
        {"skill": "Python", "importance": "High", "expected_proficiency": 80, "category": "Core Programming"},
        {"skill": "LLM APIs", "importance": "Critical", "expected_proficiency": 85, "category": "LLMs & GenAI"},
        {"skill": "Prompt Engineering", "importance": "Critical", "expected_proficiency": 85, "category": "LLMs & GenAI"},
        {"skill": "RAG", "importance": "High", "expected_proficiency": 75, "category": "Information Retrieval"},
        {"skill": "Full Stack Prototyping", "importance": "High", "expected_proficiency": 80, "category": "Application Layer"},
        {"skill": "AI Evaluation", "importance": "High", "expected_proficiency": 75, "category": "Quality & Trust"}
    ]
}

class TargetRoleAnalyzerAgent:
    @staticmethod
    async def analyze_role(target_role: str) -> List[Dict[str, Any]]:
        """
        Returns the structured skill requirements map for the target role.
        Uses predefined canonical mappings when possible, or dynamically generates via LLM.
        """
        for role_name, skills in PREDEFINED_ROLES.items():
            if role_name.lower() == target_role.strip().lower() or target_role.strip().lower() in role_name.lower():
                return skills

        # If custom target role, synthesize skill map via AI
        prompt = f"""
Analyze the target job role: '{target_role}'.
Define the top 10-12 technical capabilities required.
For each capability include:
- skill: Skill Name
- importance: "Critical" | "High" | "Medium"
- expected_proficiency: target score 0-100
- category: functional domain category

Return JSON:
{{
  "capabilities": [
    {{"skill": "Skill Name", "importance": "Critical", "expected_proficiency": 85, "category": "Domain"}}
  ]
}}
"""
        fallback = {"capabilities": PREDEFINED_ROLES["Generative AI Engineer"]}
        result = await ai_client.generate_json(
            prompt,
            system_prompt="You are EduPath's Target Role Analyzer Agent. Map job roles into concrete, measurable capabilities.",
            fallback_data=fallback
        )
        return result.get("capabilities", PREDEFINED_ROLES["Generative AI Engineer"])

target_role_analyzer = TargetRoleAnalyzerAgent()
