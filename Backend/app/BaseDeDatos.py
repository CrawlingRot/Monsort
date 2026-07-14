import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
load_dotenv()

# Cargar la URL de la base de datos desde el archivo .env
db_url = os.getenv("DATABASE_URL", "sqlite:///./monsort.db")

# Crear la conexión a la base de datos
engine = create_engine(db_url)

# Crear una sesión para interactuar con la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crear la clase base para los modelos de la base de datos
Base = declarative_base()

def get_db():
    """
    Función para obtener una sesión de base de datos.
    Esta función se utiliza como dependencia en los endpoints de FastAPI.
    """
    db = SessionLocal()  # Crear una nueva sesión de base de datos
    try:
        yield db  # Devolver la sesión para su uso en el endpoint
    finally:
        db.close()  # Cerrar la sesión después de su uso