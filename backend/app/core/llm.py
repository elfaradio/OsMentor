from langchain_ollama import ChatOllama
from backend.app.config.settings import get_settings

def get_llm(temperature: float = 0.3) -> ChatOllama:
    settings = get_settings()
    return ChatOllama(
        model=settings.ollama_model_name,
        base_url=settings.ollama_base_url,
        temperature=temperature,
    )
