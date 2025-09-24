import React, { useState } from "react";
import { Box, Input, Button, Text, Select } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";

export default function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("estudiante");
  const [teacher, setTeacher] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { username, email, password, role };
      if (role === "estudiante") body.teacher_username = teacher;

      const res = await fetch("http://localhost:8000/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al registrar");

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);

      if (onRegister) onRegister(data.access_token);
    } catch (err) {
      setError(err.message);
    }
  };

  if (token) return <Navigate to="/chat" />;

  return (
    <Box maxW="400px" mx="auto" mt={20} p={6} borderRadius="8px" bg="#1e1e1e">
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <Input
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="estudiante">Estudiante</option>
          <option value="docente">Docente</option>
        </Select>
        {role === "estudiante" && (
          <Input
            placeholder="Docente asignado"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
          />
        )}
        <Button type="submit" colorScheme="blue">
          Registrar
        </Button>
        {error && <Text color="red.400">{error}</Text>}
      </form>
    </Box>
  );
}
