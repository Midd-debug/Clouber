# routes/chat.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.security import SECRET_KEY, ALGORITHM
from jose import jwt
import sqlite3

router = APIRouter()
conn = sqlite3.connect("database/db.sqlite3", check_same_thread=False)
cursor = conn.cursor()
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except:
        raise HTTPException(status_code=401, detail="Token inválido")

@router.get("/messages")
def get_messages(user: str = Depends(get_current_user)):
    cursor.execute("SELECT user, text FROM messages")
    rows = cursor.fetchall()
    return [{"user": r[0], "text": r[1]} for r in rows]
