import json
import logging
import re
from typing import Any, Dict, Optional
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

class AIProvider:
    def __init__(self):
        self.gemini_key = settings.gemini_api_key
        self.groq_key = settings.groq_api_key
        self.model = settings.llm_model

    async def generate_json(self, prompt: str, system_prompt: str = "", fallback_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Calls Gemini, Groq, or deterministic fallback to produce a validated JSON dictionary.
        """
        # Try Gemini if key is provided
        if self.gemini_key:
            try:
                result = await self._call_gemini(prompt, system_prompt)
                if result:
                    parsed = self._extract_json(result)
                    if parsed:
                        return parsed
            except Exception as e:
                logger.warning(f"Gemini API invocation failed: {e}. Falling back...")

        # Try Groq if key is provided
        if self.groq_key:
            try:
                result = await self._call_groq(prompt, system_prompt)
                if result:
                    parsed = self._extract_json(result)
                    if parsed:
                        return parsed
            except Exception as e:
                logger.warning(f"Groq API invocation failed: {e}. Falling back...")

        # Fallback to deterministic data
        if fallback_data is not None:
            return fallback_data
        
        return {"status": "success", "message": "Processed using EduPath deterministic engine"}

    async def generate_text(self, prompt: str, system_prompt: str = "", fallback_text: str = "") -> str:
        """
        Calls LLM provider for conversational output (e.g. Copilot).
        """
        if self.gemini_key:
            try:
                result = await self._call_gemini(prompt, system_prompt)
                if result:
                    return result.strip()
            except Exception as e:
                logger.warning(f"Gemini text generation failed: {e}")

        if self.groq_key:
            try:
                result = await self._call_groq(prompt, system_prompt)
                if result:
                    return result.strip()
            except Exception as e:
                logger.warning(f"Groq text generation failed: {e}")

        return fallback_text or "I'm EduPath Copilot, your personalized learning companion."

    async def _call_gemini(self, prompt: str, system_prompt: str) -> Optional[str]:
        # Use configured model (default gemini-3.6-flash)
        model_name = self.model or "gemini-3.6-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={self.gemini_key}"
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": f"{system_prompt}\n\n{prompt}" if system_prompt else prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 4096
            }
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "")
            else:
                logger.warning(f"Gemini API ({model_name}) returned code {resp.status_code}: {resp.text}")
                if model_name != "gemini-3.6-flash":
                    url_fallback = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={self.gemini_key}"
                    resp2 = await client.post(url_fallback, json=payload)
                    if resp2.status_code == 200:
                        data = resp2.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts:
                                return parts[0].get("text", "")
        return None

    async def _call_groq(self, prompt: str, system_prompt: str) -> Optional[str]:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.groq_key}",
            "Content-Type": "application/json"
        }
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": messages,
            "temperature": 0.2
        }
        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                return data["choices"][0]["message"]["content"]
            else:
                logger.warning(f"Groq API returned code {resp.status_code}: {resp.text}")
        return None

    def _extract_json(self, text: str) -> Optional[Dict[str, Any]]:
        try:
            return json.loads(text)
        except Exception:
            pass

        # Match markdown block ```json ... ```
        pattern = r"```(?:json)?\s*([\s\S]*?)\s*```"
        matches = re.findall(pattern, text)
        for m in matches:
            try:
                return json.loads(m.strip())
            except Exception:
                continue

        # Look for { ... }
        match = re.search(r"\{[\s\S]*\}", text)
        if match:
            try:
                return json.loads(match.group(0))
            except Exception:
                pass

        return None

ai_client = AIProvider()
