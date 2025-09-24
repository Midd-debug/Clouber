import React from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ onLogout }) {
  const location = useLocation();

  return (
    <Box bg="#1a1a1a" px={6} py={4} boxShadow="0 2px 10px rgba(0,0,0,0.5)">
      <Flex justifyContent="space-between" alignItems="center">
        <Text color="#4DA6FF" fontWeight="bold" fontSize="xl">
          Clouber 🇳🇮
        </Text>
        <Flex gap={3}>
          {location.pathname !== "/login" && location.pathname !== "/register" && (
            <Button size="sm" colorScheme="red" onClick={onLogout}>
              Logout
            </Button>
          )}
          {location.pathname === "/login" && (
            <Link to="/register">
              <Button size="sm" colorScheme="blue">
                Registro
              </Button>
            </Link>
          )}
          {location.pathname === "/register" && (
            <Link to="/login">
              <Button size="sm" colorScheme="blue">
                Login
              </Button>
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
