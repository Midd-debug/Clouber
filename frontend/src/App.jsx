import React, { useState, useEffect } from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <ChakraProvider>
      {/* Navbar recibe el estado de autenticación */}
      <Navbar onLogout={handleLogout} isAuthenticated={isAuthenticated} />

      <Box bg="#121212" minH="100vh" color="white" p={4}>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/chat" /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/chat" /> : <Register onRegister={handleLogin} />
            }
          />
          <Route
            path="/chat"
            element={isAuthenticated ? <Chat /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Box>
    </ChakraProvider>
  );
}
