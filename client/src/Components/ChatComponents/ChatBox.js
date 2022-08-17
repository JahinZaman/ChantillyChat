import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      p={3}
      bg="#36393f"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      color="white"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
