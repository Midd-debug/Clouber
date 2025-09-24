import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function Chat({ onLogout }) {
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy tu tutor educativo.", user: false },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [summary, setSummary] = useState("");
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    setMessages((prev) => [...prev, { text: input, user: true }]);
    const userMessage = input;
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token 
        },
        body: JSON.stringify({ question: userMessage }), // <--- CORREGIDO
      });
      const data = await res.json();

      const botText = data.answer; // <--- CORREGIDO
      let index = 0;
      let displayedText = "";

      const interval = setInterval(() => {
        displayedText += botText[index];
        setMessages((prev) => {
          const newMessages = [...prev];
          if (newMessages.some((m) => m.user === false && m.typing)) {
            newMessages[newMessages.length - 1] = { text: displayedText, user: false, typing: true };
          } else {
            newMessages.push({ text: displayedText, user: false, typing: true });
          }
          return newMessages;
        });
        index++;
        if (index >= botText.length) {
          clearInterval(interval);
          setMessages((prev) =>
            prev.map((m) => (m.typing ? { ...m, typing: false } : m))
          );
          setIsTyping(false);
        }
      }, 20);
    } catch (err) {
      setMessages((prev) => [...prev, { text: "Error al obtener respuesta 😓", user: false }]);
      setIsTyping(false);
    }
  };

  const generateSummary = async () => {
    if (messages.length === 0) return;
    setIsTyping(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token 
        },
        body: JSON.stringify({
          question:
            "Resume la siguiente conversación de forma clara y educativa:\n" +
            messages.map((m) => `${m.user ? "Usuario:" : "Bot:"} ${m.text}`).join("\n"),
        }),
      });
      const data = await res.json();
      setSummary(data.answer); // <--- CORREGIDO
    } catch (err) {
      setSummary("Error al generar resumen 😓");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Box bg="#121212" h="100vh" display="flex" flexDirection="column">
      {/* Navbar */}
      <Box
        bg="#1a1a1a"
        p={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        boxShadow="0 2px 10px rgba(0,0,0,0.5)"
      >
        <Text color="#4DA6FF" fontWeight="bold" fontSize="xl">
          Chat Clouber 🇳🇮
        </Text>
        <Button
          size="sm"
          colorScheme="red"
          onClick={onLogout}
        >
          Logout
        </Button>
      </Box>

      {/* Contenedor principal */}
      <Box display="flex" flex="1" overflow="hidden">
        {/* Sidebar / Easter eggs */}
        <Box
          w="220px"
          bg="#1a1a1a"
          p={4}
          borderRight="1px solid #333"
          display="flex"
          flexDirection="column"
          gap={4}
        >
          {["🐦 Guardabarranco", "🌋 Volcán", "🌼 Sacuanjoche"].map((egg, idx) => (
            <motion.div
              key={idx}
              className="easter-egg"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "10px",
                borderRadius: "12px",
                background: "#222",
                textAlign: "center",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                color: "#fff",
              }}
            >
              {egg}
            </motion.div>
          ))}
        </Box>

        {/* Chat central */}
        <Box flex="1" display="flex" flexDirection="column" p={4} overflow="hidden">
          <Box flex="1" overflowY="auto" mb={4} display="flex" flexDirection="column" gap={2}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  alignSelf: msg.user ? "flex-end" : "flex-start",
                  background: msg.user ? "#0d47a1" : "#222",
                  color: "#fff",
                  padding: "12px 16px",
                  borderRadius: "18px",
                  maxWidth: "70%",
                }}
              >
                {msg.text}
                {msg.typing && <span className="typing-cursor">|</span>}
              </motion.div>
            ))}
            <div ref={chatEndRef}></div>
          </Box>

          {/* Input */}
          <form onSubmit={handleSend} style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder="Escribe tu mensaje..."
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "12px 0 0 12px",
                border: "1px solid #333",
                background: "#1a1a1a",
                color: "#fff",
                outline: "none",
              }}
            />
            <motion.button
              type="submit"
              disabled={isTyping}
              whileHover={{ scale: 1.05, boxShadow: "0 0 10px #4DA6FF" }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "0 20px",
                borderRadius: "0 12px 12px 0",
                background: "#4DA6FF",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Enviar
            </motion.button>
          </form>
        </Box>

        {/* Info column */}
        <Box
          w="220px"
          bg="#1a1a1a"
          p={4}
          borderLeft="1px solid #333"
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Text fontWeight="bold" color="#4DA6FF">
            Sugerencias
          </Text>
          <Text fontSize="sm" color="#ddd">
            - Haz click en los Easter eggs 🐦🌋🌼
          </Text>
          <Text fontSize="sm" color="#ddd">
            - Pregunta cualquier tema educativo
          </Text>
          <Text fontSize="sm" color="#ddd">
            - La IA te explicará paso a paso
          </Text>
          <motion.button
            onClick={generateSummary}
            whileHover={{ scale: 1.05, boxShadow: "0 0 10px #4DA6FF" }}
            whileTap={{ scale: 0.95 }}
            style={{
              marginTop: "auto",
              padding: "8px 12px",
              background: "#4DA6FF",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Generar Resumen
          </motion.button>
          {summary && (
            <Text mt={2} fontSize="sm" color="#ddd">
              {summary}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
}
