import React, { useState, useEffect, useRef } from "react";
import API from "../api";
import "./Chat.css";

export default function Chat({ token }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll automático al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const res = await API.post(
        "/chat/",
        { question: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Animación de tipeo
      const answer = res.data.answer;
      let i = 0;
      const botMessage = { sender: "bot", text: "" };
      setMessages(prev => [...prev, botMessage]);

      const interval = setInterval(() => {
        i++;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = answer.slice(0, i);
          return newMessages;
        });
        if (i >= answer.length) clearInterval(interval);
      }, 25); // velocidad de tipeo
    } catch (err) {
      alert("Error al enviar mensaje: " + err.response?.data?.detail || err.message);
    }
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((m, idx) => (
          <div key={idx} className={`message ${m.sender}`}>
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-box">
        <input
          type="text"
          value={input}
          placeholder="Escribe tu mensaje..."
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}
