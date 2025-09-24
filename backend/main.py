# main.py
import os
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Date, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
import openai
from dotenv import load_dotenv

# --- Cargar variables de entorno ---
load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "wilbiancito2013")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise RuntimeError("Define OPENAI_API_KEY en variables de entorno.")

DATABASE_URL = "sqlite:///./clouber.db"

# --- FastAPI ---
app = FastAPI(title="Clouber Nica Educativo")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DB ---
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()

# --- Modelos ---
class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)
    email = Column(String, unique=True, index=True)
    section = Column(String, nullable=True)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    students = relationship("StudentTeacher", back_populates="teacher", foreign_keys="[StudentTeacher.teacher_id]")
    teacher_link = relationship("StudentTeacher", back_populates="student", foreign_keys="[StudentTeacher.student_id]")
    history = relationship("ChatHistory", back_populates="student")
    tasks = relationship("Task", back_populates="student")

class StudentTeacher(Base):
    __tablename__ = "student_teacher"
    id = Column(Integer, primary_key=True)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    student_id = Column(Integer, ForeignKey("users.id"))

    teacher = relationship("UserDB", foreign_keys=[teacher_id], back_populates="students")
    student = relationship("UserDB", foreign_keys=[student_id], back_populates="teacher_link")

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    question = Column(Text)
    answer = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    student = relationship("UserDB", back_populates="history")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    description = Column(Text)
    due_date = Column(Date)
    student = relationship("UserDB", back_populates="tasks")

Base.metadata.create_all(bind=engine)

# --- Seguridad ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Pydantic ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str
    teacher_username: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    username: str
    email: EmailStr
    role: str

class TaskCreate(BaseModel):
    title: str
    description: str
    due_date: datetime

class ChatQuestion(BaseModel):
    question: str

# --- Funciones util ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user(db: Session, username: str):
    return db.query(UserDB).filter(UserDB.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(lambda: SessionLocal())):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No autorizado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(db, username=username)
    if user is None:
        raise credentials_exception
    return user

def build_openai_prompt(question: str) -> str:
    return f"""
Eres un asistente educativo que responde preguntas de estudiantes nicaragüenses. Tu estilo es coloquial, cercano, como si hablaras con alguien en Nicaragua. Das respuestas claras pero no completas, para que la persona investigue más por su cuenta. Siempre ofreces al menos dos links o fuentes confiables para ampliar la información. El tema puede ser académico, ambiental o cultural, pero siempre ambientado en Nicaragua.

Pregunta: {question}

Respuesta:
"""

# --- DB ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Endpoints ---
@app.post("/register/", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail=f"El usuario '{user.username}' ya existe")
    
    hashed_password = get_password_hash(user.password)
    db_user = UserDB(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Asignar docente si es estudiante
    if user.role.lower() == "estudiante" and user.teacher_username:
        teacher = get_user(db, user.teacher_username)
        if not teacher or teacher.role.lower() != "docente":
            raise HTTPException(status_code=400, detail=f"Docente '{user.teacher_username}' no encontrado o inválido")
        assoc = StudentTeacher(teacher_id=teacher.id, student_id=db_user.id)
        db.add(assoc)
        db_user.teacher_id = teacher.id
        db.commit()

    # Generar token como login
    access_token = create_access_token(data={"sub": db_user.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/chat/")
def chat_response(data: ChatQuestion, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    prompt = build_openai_prompt(data.question)
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=250,
        )
        answer = completion.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al llamar a OpenAI: {e}")

    # Guardar historial si es estudiante
    if current_user.role.lower() == "estudiante":
        chat_hist = ChatHistory(student_id=current_user.id, question=data.question, answer=answer)
        db.add(chat_hist)
        db.commit()

    return {"answer": answer}



@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/chat/")
def chat_response(data: ChatQuestion, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    prompt = build_openai_prompt(data.question)
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=250,
        )
        answer = completion.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al llamar a OpenAI: {e}")

    if current_user.role == "estudiante":
        chat_hist = ChatHistory(student_id=current_user.id, question=data.question, answer=answer)
        db.add(chat_hist)
        db.commit()

    return {"answer": answer}

@app.get("/docente/historial/{student_username}")
def get_student_history(student_username: str, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "docente":
        raise HTTPException(status_code=403, detail="Solo docentes pueden acceder")
    student = get_user(db, student_username)
    if not student or student.role != "estudiante":
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    assoc = db.query(StudentTeacher).filter(
        StudentTeacher.teacher_id == current_user.id,
        StudentTeacher.student_id == student.id
    ).first()
    if not assoc:
        raise HTTPException(status_code=403, detail="No tienes acceso a ese estudiante")
    history = db.query(ChatHistory).filter(ChatHistory.student_id == student.id).order_by(ChatHistory.timestamp.desc()).all()
    return [{"question": h.question, "answer": h.answer, "timestamp": h.timestamp} for h in history]

@app.post("/tasks/")
def add_task(task: TaskCreate, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "estudiante":
        raise HTTPException(status_code=403, detail="Solo estudiantes pueden agregar tareas")
    task_db = Task(student_id=current_user.id, title=task.title, description=task.description, due_date=task.due_date)
    db.add(task_db)
    db.commit()
    return {"msg": "Tarea agregada con éxito"}

@app.get("/tasks/")
def get_tasks(current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "estudiante":
        raise HTTPException(status_code=403, detail="Solo estudiantes pueden ver sus tareas")
    tasks = db.query(Task).filter(Task.student_id == current_user.id).all()
    return [{"title": t.title, "description": t.description, "due_date": t.due_date} for t in tasks]

@app.get("/")
def root():
    return {"msg": "¡Qué onda, mi gente! Bienvenidos a Clouber Nica Educativo!"}
