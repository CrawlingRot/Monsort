from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./monsort.db"
    SECRET_KEY: str = "dev-secret-key"
    ALGORITMO: str = "HS256"
    TOKEN_ACCESO_MIN_EXPIRACION: int = 30
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()