import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Text, Input, IconButton, Tooltip } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiPlus, FiSave, FiClipboard } from "react-icons/fi";

// Componente de puntos de escritura para IA
const TypingDots = () => (
  <Box display="flex" gap="2px">
    {[".", ".", "."].map((d, i) => (
      <motion.div
        key={i}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#fff",
        }}
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
      />
    ))}
  </Box>
);

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([{ text: "¡Hola! Soy tu tutor educativo.", user: false }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [summary, setSummary] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState("");
  const chatEndRef = useRef(null);

  // Cargar chats guardados
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("clouberChats") || "[]");
    setChats(stored);
    if (stored.length > 0) {
      setCurrentChat(stored[0].name);
      setMessages(stored[0].messages || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("clouberChats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const newChat = () => {
    const name = prompt("Nombre del nuevo chat:");
    if (!name) return;
    const c = { name, messages: [{ text: "Nuevo chat — empieza a preguntar", user: false }], timestamp: new Date().toISOString() };
    setChats((p) => [c, ...p]);
    setCurrentChat(name);
    setMessages(c.messages);
  };

  const saveChat = () => {
    if (!currentChat) return newChat();
    setChats((prev) =>
      prev.map((c) => (c.name === currentChat ? { ...c, messages, timestamp: new Date().toISOString() } : c))
    );
  };

  const deleteChat = (name) => {
    if (!confirm(`Eliminar chat "${name}"?`)) return;
    setChats((prev) => prev.filter((c) => c.name !== name));
    if (currentChat === name) {
      setCurrentChat("");
      setMessages([{ text: "¡Hola! Soy tu tutor educativo.", user: false }]);
    }
  };

  const loadChat = (name) => {
    const chat = chats.find((c) => c.name === name);
    if (!chat) return;
    setMessages(chat.messages || []);
    setCurrentChat(name);
  };

  const copyText = (text) => navigator.clipboard?.writeText(text);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    setMessages((prev) => [...prev, { text: input, user: true }]);
    const userMessage = input;
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return logout();

      const res = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Error ${res.status}`);
      }

      const data = await res.json();
      const botText = data.answer || "No hubo respuesta.";

      let i = 0;
      let displayed = "";
      const interval = setInterval(() => {
        if (i >= botText.length) {
          clearInterval(interval);
          setMessages((prev) => prev.map((m) => (m.typing ? { ...m, typing: false } : m)));
          setIsTyping(false);
          return;
        }
        displayed += botText[i++];
        setMessages((prev) => {
          const copy = [...prev];
          const lastTypingIndex = copy.findIndex((m) => m.typing);
          if (lastTypingIndex >= 0) {
            copy[lastTypingIndex] = { ...copy[lastTypingIndex], text: displayed };
          } else {
            copy.push({ text: displayed, user: false, typing: true });
          }
          return copy;
        });
      }, 12);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { text: "Error al contactar el servidor.", user: false }]);
      setIsTyping(false);
    }
  };

  const generateSummary = async () => {
    if (!messages.length) return;
    setIsTyping(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({
          question:
            "Resume la conversación de forma ordenada:\n" +
            messages.map((m) => `${m.user ? "Usuario:" : "Bot:"} ${m.text}`).join("\n"),
        }),
      });
      const data = await res.json();
      setSummary(data.answer || "No hay resumen disponible.");
    } catch {
      setSummary("Error generando resumen.");
    } finally {
      setIsTyping(false);
    }
  };

  const listVariant = { visible: { transition: { staggerChildren: 0.05 } } };
  const itemVariant = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } };

  return (
    <Box display="flex" flexDirection="column" h="100vh" bg="#0e0f13" color="#e9eef5" fontFamily="Inter, sans-serif">
      {/* NAV */}
      <Box bg="#0c0d11" p={3} display="flex" justifyContent="space-between" alignItems="center" borderBottom="1px solid #1c1e26">
        <Text fontWeight="700" fontSize="lg" color="#6ea7ff">Clouber — Tutor</Text>
        <Button size="sm" colorScheme="red" onClick={logout}>Salir</Button>
      </Box>

      <Box display="flex" flex="1" overflow="hidden">
        {/* LEFT */}
        <Box w="260px" bg="#0c0d11" p={3} borderRight="1px solid #1c1e26" display="flex" flexDirection="column">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Text fontWeight="600" color="#9bb9ff">Chats</Text>
            <Box>
              <IconButton aria-label="new" icon={<FiPlus />} size="sm" onClick={newChat} mr={2} />
              <IconButton aria-label="save" icon={<FiSave />} size="sm" onClick={saveChat} />
            </Box>
          </Box>
          <Box flex="1" overflowY="auto" className="scroll-fade">
            <AnimatePresence initial={false}>
              {chats.map((c, idx) => (
                <motion.div
                  key={c.name + idx}
                  layout
                  variants={itemVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ scale: 1.02 }}
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    marginBottom: "6px",
                    cursor: "pointer",
                    background: currentChat === c.name ? "#1c1e26" : "transparent",
                    color: "#dfe9ff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box onClick={() => loadChat(c.name)}>
                    <Text fontWeight="500">{c.name}</Text>
                    <Text fontSize="xs" color="#7c89a3">{new Date(c.timestamp).toLocaleString()}</Text>
                  </Box>
                  <IconButton size="sm" icon={<FiTrash2 />} aria-label="delete" onClick={() => deleteChat(c.name)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        </Box>

        {/* CENTER: Chat */}
        <Box flex="1" display="flex" flexDirection="column" p={4} bg="#0e0f13">
          <Box flex="1" overflowY="auto" mb={3} className="scroll-fade">
            <motion.div variants={listVariant} initial="hidden" animate="visible">
              <AnimatePresence initial={false}>
                {messages.map((m, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariant}
                    exit="exit"
                    initial={{ opacity: 0, x: m.user ? 100 : -100, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <Box
                      maxWidth="70%"
                      p={3}
                      mb={3}
                      borderRadius="20px"
                      bg={m.user ? "linear-gradient(135deg,#2a6bff,#0d47a1)" : "#1c1e26"}
                      color="#fff"
                      boxShadow={m.user ? "0 6px 20px rgba(45,100,255,0.18)" : "0 4px 15px rgba(0,0,0,0.5)"}
                      alignSelf={m.user ? "flex-end" : "flex-start"}
                      style={{ whiteSpace: "pre-wrap", position: "relative" }}
                    >
                      <Text fontSize="sm">{m.text}</Text>
                      {!m.user && m.typing && <TypingDots />}
                      {!m.user && !m.typing && (
                        <Tooltip label="Copiar respuesta">
                          <IconButton
                            size="sm"
                            icon={<FiClipboard />}
                            onClick={() => copyText(m.text)}
                            position="absolute"
                            top={2}
                            right={2}
                            variant="ghost"
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <div ref={chatEndRef} />
          </Box>

          <Box as="form" onSubmit={handleSend} display="flex" gap={3}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isTyping ? "La IA está escribiendo..." : "Escribe tu pregunta..."}
              bg="#1c1e26"
              color="#e9eef5"
              border="1px solid #2a2d38"
              borderRadius="lg"
            />
            <Button type="submit" colorScheme="blue" isDisabled={isTyping}>Enviar</Button>
          </Box>
        </Box>

        {/* RIGHT: Resumen */}
        <Box w="280px" bg="#0c0d11" p={4} borderLeft="1px solid #1c1e26" display="flex" flexDirection="column">
          <Text fontWeight="600" color="#9bb9ff">Resumen</Text>
          <Box mt={3} flex="1" overflowY="auto" className="scroll-fade">
            {summary ? (
              <Box bg="#1c1e26" p={3} borderRadius="12px" boxShadow="0 2px 8px rgba(0,0,0,0.3)">
                <Text fontSize="sm" mb={2}>{summary}</Text>
                <Button size="sm" onClick={() => navigator.clipboard?.writeText(summary)}>Copiar resumen</Button>
              </Box>
            ) : (
              <Box>
                <Text fontSize="sm" color="#7c89a3">Genera un resumen de la conversación.</Text>
                <Box mt={3} display="flex" flexDirection="column" gap={2}>
                  <Button size="sm" onClick={() => generateSummary()}>Generar</Button>
                  <Button size="sm" variant="ghost" onClick={() => setSummary("")}>Borrar</Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
