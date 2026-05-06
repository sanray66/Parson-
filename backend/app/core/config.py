from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Parson"
    debug: bool = True
    database_url: str
    openrouter_api_key: str
    cors_origins: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]
    static_dir: str = "static"
    image_dir: str = "static/images"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()