import React from "react";
import { Box, VStack, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <Box w="60" bg="gray.800" p="4">
      <VStack spacing="4" align="stretch">
        <Button as={Link} to="/" colorScheme="teal">Home</Button>
        <Button as={Link} to="/profile" colorScheme="teal">Perfil</Button>
        <Button colorScheme="teal">Tareas</Button>
        <Button colorScheme="teal">Chat</Button>
        <Button colorScheme="red" variant="outline">Salir</Button>
      </VStack>
    </Box>
  );
}

export default Sidebar;
