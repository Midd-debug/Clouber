import { useState } from "react";
import { Input, Button, Box, Text } from "@chakra-ui/react";
import { sendChat } from "../api/api";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);

  const handleSend = async () => {
    const res = await sendChat(question);
    setAnswers([{ question, answer: res.data.answer }, ...answers]);
    setQuestion("");
  };

  return (
    <Box mb={4}>
      <Input placeholder="Escribe tu pregunta..." value={question} onChange={(e) => setQuestion(e.target.value)} mb={2} />
      <Button onClick={handleSend} mb={4}>Enviar</Button>
      {answers.map((a, i) => (
        <Box key={i} mb={2} p={2} borderWidth="1px" borderRadius="md">
          <Text fontWeight="bold">Pregunta: {a.question}</Text>
          <Text>Respuesta: {a.answer}</Text>
        </Box>
      ))}
    </Box>
  );
}
