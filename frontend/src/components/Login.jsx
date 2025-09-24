import React, { useState } from "react";
import { Box, Input, Button, Text } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch("http://localhost:8000/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!res.ok) throw new Error("Usuario o contraseña incorrectos");

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);

      if (onLogin) onLogin(data.access_token);
    } catch (err) {
      setError(err.message);
    }
  };

  // Redirige automáticamente al chat si ya hay token
  if (token) return <Navigate to="/chat" />;

  return (
    <Box maxW="400px" mx="auto" mt={20} p={6} borderRadius="8px" bg="#1e1e1e">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Input placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <Input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" colorScheme="blue">Login</Button>
        {error && <Text color="red.400">{error}</Text>}
      </form>
    </Box>
  );
}
