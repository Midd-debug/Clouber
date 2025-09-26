import { useState, useEffect } from "react";
import { Input, Button, Box, Text } from "@chakra-ui/react";
import { getTasks, addTask } from "../api/api";

export default function Tasks() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };

  const handleAdd = async () => {
    await addTask({ title, description: desc, due_date: new Date().toISOString() });
    setTitle(""); setDesc("");
    loadTasks();
  };

  useEffect(() => { loadTasks(); }, []);

  return (
    <Box mb={4}>
      <Input placeholder="Título de tarea" value={title} onChange={(e) => setTitle(e.target.value)} mb={2} />
      <Input placeholder="Descripción" value={desc} onChange={(e) => setDesc(e.target.value)} mb={2} />
      <Button onClick={handleAdd} mb={4}>Agregar tarea</Button>
      {tasks.map((t, i) => (
        <Box key={i} p={2} borderWidth="1px" borderRadius="md" mb={2}>
          <Text fontWeight="bold">{t.title}</Text>
          <Text>{t.description}</Text>
          <Text>Fecha: {new Date(t.due_date).toLocaleDateString()}</Text>
        </Box>
      ))}
    </Box>
  );
}
