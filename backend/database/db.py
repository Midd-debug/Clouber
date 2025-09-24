# database/db.py
import sqlite3

conn = sqlite3.connect("database/db.sqlite3", check_same_thread=False)
cursor = conn.cursor()

# Crear tabla de usuarios
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
""")

# Crear tabla de mensajes
cursor.execute("""
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    text TEXT NOT NULL
)
""")

conn.commit()
