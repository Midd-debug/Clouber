import React, { useState } from "react";
import API from "../api";

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await API.post("/token", formData);
      setToken(res.data.access_token);
    } catch (err) {
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
}
