// src/components/Login.jsx
import React, { useState } from "react";
import { Box, Input, Button, Text, VStack } from "@chakra-ui/react";
import { Navigate, useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch("http://localhost:8000/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Usuario o contraseña incorrectos");

      localStorage.setItem("token", data.access_token);
      if (onLogin) onLogin(data.access_token);
      navigate("/chat");
    } catch (err) {
      setError(err.message);
    }
  };

  if (token) return <Navigate to="/chat" />;

  return (
    <Box maxW="400px" mx="auto" mt={20} p={6} borderRadius="12px" bg="darkpanel">
      <Text fontSize="2xl" mb={6} textAlign="center" color="brand.500">Login</Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Input
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            bg="#222"
            color="darktext"
            borderColor="#333"
            _focus={{ borderColor: "brand.500", boxShadow: "0 0 10px #4DA6FF66" }}
            required
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            bg="#222"
            color="darktext"
            borderColor="#333"
            _focus={{ borderColor: "brand.500", boxShadow: "0 0 10px #4DA6FF66" }}
            required
          />
          {error && <Text color="error">{error}</Text>}
          <Button type="submit" w="full" bg="brand.500" color="#fff" _hover={{ bg: "brand.700" }}>
            Entrar
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
