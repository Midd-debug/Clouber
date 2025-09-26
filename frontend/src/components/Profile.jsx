import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
function Profile({ user }) {
  return (
    <Box bg="gray.800" p="4" borderRadius="md" maxW="md" mx="auto">
      <Text fontWeight="bold" fontSize="lg">Perfil</Text>
      <Text>Nombre: {user?.name || "Estudiante"}</Text>
      <Text>Email: {user?.email || "estudiante@example.com"}</Text>
    </Box>
  );
}

export default Profile;
