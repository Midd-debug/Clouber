import React from "react";
import { VStack } from "@chakra-ui/react";
import TaskForm from "../components/TaskForm";
import ChatBox from "../components/ChatBox";

function Home() {
  return (
    <VStack spacing="6" p="6" align="stretch">
      <TaskForm />
      <ChatBox />
    </VStack>
  );
}

export default Home;
