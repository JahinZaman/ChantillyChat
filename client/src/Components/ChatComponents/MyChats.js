import {
  useToast,
  Box,
  Button,
  Stack,
  Text,
  MenuItem,
  Menu,
  MenuList,
  MenuButton,
  Avatar,
  MenuDivider,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { AddIcon, ChevronDownIcon, PlusSquareIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();
  const history = useHistory();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load chat data",
        status: "error",
        duration: 5000,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      height="102.5%"
      bg="rgba(255,255,255,0)"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderColor="#373535"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Noto Sans"
        display="flex"
        width="100%"
        bg="black"
        justifyContent="space-between"
        alignItems="center"
      >
        Direct Messages
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            bg="black"
            color="#cfddde"
          >
            New Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#010411"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="auto">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#DADCE3" : "#230101"}
                color={selectedChat === chat ? "black" : "white"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                <Menu>
                  <MenuButton
                    color="black"
                    as={Button}
                    rightIcon={<PlusSquareIcon />}
                  >
                    <Avatar
                      size="sm"
                      cursor="pointer"
                      name={chat.users[0].name}
                      src={chat.users[0].pic}
                    />
                  </MenuButton>
                  <MenuList>
                    <ProfileModal user={chat.users[0]}>
                      <MenuItem color="black">Profile</MenuItem>
                    </ProfileModal>
                  </MenuList>
                </Menu>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading></ChatLoading>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
