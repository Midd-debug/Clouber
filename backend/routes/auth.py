# routes/auth.py
from fastapi import APIRouter, HTTPException
from models.user import UserCreate, UserLogin
from utils.security import hash_password, verify_password, create_access_token
import sqlite3

router = APIRouter()
conn = sqlite3.connect("database/db.sqlite3", check_same_thread=False)
cursor = conn.cursor()

@router.post("/register")
def register(user: UserCreate):
    try:
        hashed = hash_password(user.password)
        cursor.execute("INSERT INTO users (email, password) VALUES (?, ?)", (user.email, hashed))
        conn.commit()
        return {"success": True, "message": "Usuario registrado"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email ya registrado")

@router.post("/login")
def login(user: UserLogin):
    cursor.execute("SELECT password FROM users WHERE email = ?", (user.email,))
    row = cursor.fetchone()
    if not row or not verify_password(user.password, row[0]):
        raise HTTPException(status_code=400, detail="Usuario o contraseña incorrectos")
    token = create_access_token({"sub": user.email})
    return {"token": token}
