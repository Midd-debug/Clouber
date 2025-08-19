import React, { useState } from "react";
import API from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("estudiante"); // puede ser estudiante o docente

  const handleRegister = async () => {
    try {
      const res = await API.post("/register/", { username, email, password, role });
      alert(`Usuario ${res.data.username} registrado con éxito`);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      alert("Error al registrar usuario: " + err.response?.data?.detail || err.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="estudiante">Estudiante</option>
        <option value="docente">Docente</option>
      </select>
      <button onClick={handleRegister}>Registrar</button>
    </div>
  );
}
