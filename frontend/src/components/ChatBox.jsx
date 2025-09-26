// ChatBox.jsx
import React, { useState } from "react";
import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";

export default function ChatBox({ onSend, messages }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() === "") return;
    onSend(message); // envia la pregunta al Chat
    setMessage("");
  };

  return (
    <Box bg="gray.800" p="4" borderRadius="md">
      <VStack spacing="3">
        <Input
          placeholder="Haz tu pregunta..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleSend}>
          Enviar
        </Button>

        {/* Mostrar historial de mensajes */}
        {messages.map((m, i) => (
          <Box key={i} p={2} borderWidth="1px" borderRadius="md" w="100%">
            <Text fontWeight="bold">Pregunta: {m.question}</Text>
            <Text>Respuesta: {m.answer}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
