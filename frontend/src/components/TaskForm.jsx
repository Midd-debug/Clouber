import React, { useState } from "react";
import { Box, Input, Textarea, Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    console.log({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <Box bg="gray.800" p="4" borderRadius="md">
      <Stack spacing="3">
        <Input placeholder="Título de la tarea" value={title} onChange={e => setTitle(e.target.value)} />
        <Textarea placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} />
        <Button colorScheme="teal" onClick={handleSubmit}>Agregar Tarea</Button>
      </Stack>
    </Box>
  );
}

export default TaskForm;
