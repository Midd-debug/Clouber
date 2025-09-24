import {
  Box, Button, Flex, FormControl, FormLabel, Input, InputGroup,
  InputRightElement, Heading, Text, Link, useToast
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmPassword: "" });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.email || !form.password || !form.confirmPassword) {
      toast({ title: "Error", description: "Todos los campos son obligatorios", status: "error", duration: 3000, isClosable: true });
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast({ title: "Error", description: "Las contraseñas no coinciden", status: "error", duration: 3000, isClosable: true });
      return;
    }

    toast({ title: "Registro exitoso", description: `Bienvenido, ${form.nombre}`, status: "success", duration: 3000, isClosable: true });
    navigate("/login"); // volver a LoginScreen
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box bg="white" p={8} rounded="lg" shadow="lg" w="sm">
        <Heading mb={6} textAlign="center">Crear Cuenta</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl id="nombre" mb={4} isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input type="text" name="nombre" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} />
          </FormControl>
          <FormControl id="email" mb={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" placeholder="correo@ejemplo.com" value={form.email} onChange={handleChange} />
          </FormControl>
          <FormControl id="password" mb={4} isRequired>
            <FormLabel>Contraseña</FormLabel>
            <InputGroup>
              <Input type={showPassword ? "text" : "password"} name="password" placeholder="********" value={form.password} onChange={handleChange} />
              <InputRightElement>
                <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="confirmPassword" mb={4} isRequired>
            <FormLabel>Confirmar Contraseña</FormLabel>
            <Input type="password" name="confirmPassword" placeholder="********" value={form.confirmPassword} onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="green" w="full" mb={4}>Registrarse</Button>
        </form>
        <Text textAlign="center" fontSize="sm">
          ¿Ya tienes cuenta? <Link as={RouterLink} to="/login" color="blue.400">Inicia sesión</Link>
        </Text>
      </Box>
    </Flex>
  );
}
