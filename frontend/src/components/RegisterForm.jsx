import React, { useState } from "react";
import { Box, Input, Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    console.log({ username, email, password });
  };

  return (
    <Box bg="gray.800" p="6" borderRadius="md" maxW="sm" mx="auto" mt="20">
      <Stack spacing="4">
        <Input placeholder="Nombre de usuario" value={username} onChange={e => setUsername(e.target.value)} />
        <Input placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        <Button colorScheme="teal" onClick={handleRegister}>Registrar</Button>
      </Stack>
    </Box>
  );
}

export default RegisterForm;
