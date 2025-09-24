import {
  Box, Button, Flex, FormControl, FormLabel, Input, InputGroup,
  InputRightElement, Heading, Text, Link, useToast
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({ title: "Error", description: "Todos los campos son obligatorios", status: "error", duration: 3000, isClosable: true });
      return;
    }

    toast({ title: "Login exitoso", description: `Bienvenido, ${email}`, status: "success", duration: 3000, isClosable: true });
    navigate("/home"); // ir a HomeScreen
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box bg="white" p={8} rounded="lg" shadow="lg" w="sm">
        <Heading mb={6} textAlign="center">Iniciar Sesión</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl id="email" mb={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl id="password" mb={4} isRequired>
            <FormLabel>Contraseña</FormLabel>
            <InputGroup>
              <Input type={showPassword ? "text" : "password"} placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
              <InputRightElement>
                <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button type="submit" colorScheme="blue" w="full" mb={4}>Entrar</Button>
        </form>
        <Text textAlign="center" fontSize="sm">
          ¿No tienes cuenta? <Link as={RouterLink} to="/register" color="blue.400">Regístrate</Link>
        </Text>
      </Box>
    </Flex>
  );
}
