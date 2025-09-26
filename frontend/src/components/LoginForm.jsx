import React, { useState } from "react";
import { Box, Input, Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log({ email, password });
  };

  return (
    <Box bg="gray.800" p="6" borderRadius="md" maxW="sm" mx="auto" mt="20">
      <Stack spacing="4">
        <Input placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        <Button colorScheme="teal" onClick={handleLogin}>Login</Button>
      </Stack>
    </Box>
  );
}

export default LoginForm;
