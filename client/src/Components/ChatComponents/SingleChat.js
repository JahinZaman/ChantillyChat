import { ArrowBackIcon, AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Text,
  Toast,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import "./styles.css";
import io from "socket.io-client";

const ENDPOINT = "https://chantilly-chat.herokuapp.com/";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [pic, setPic] = useState();
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
  };

  const postNewImage = async (pics) => {
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/gif" ||
      pics.type === "image/jfif"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "jahz");
      fetch("https://api.cloudinary.com/v1_1/jahz/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: pic,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);
  const {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();
  const sendMessage = async (event) => {
    socket.emit("stop typing", selectedChat._id);
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log(messages);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Cannot Load Messages at this time",
        status: error,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        if (!notification.includes(newMessage)) {
          setNotification([newMessage, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="Noto Sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
              color="black"
            ></IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="lightgrey "
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="20px"
                width={20}
                height={20}
                alignSelf="center"
                margin="auto"
                color="black"
              />
            ) : (
              <div className="messages">
                {<ScrollableChat messages={messages} />}
              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              mt={3}
              display="flex"
            >
              {newMessage.length > 0 ? (
                <div bg="black">
                  {/* <Text color="white" fontWeight="bold">
                    {user.name} is typing
                  </Text> */}
                </div>
              ) : (
                <></>
              )}
              <InputGroup size="lg" mt={2}>
                <Input
                  display="flex"
                  flexDirection="row"
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                  color="black"
                ></Input>
                <InputLeftElement h="50px" width="50px">
                  <FormLabel
                    htmlFor="filePicker"
                    fontSize="40px"
                    marginLeft="20px"
                    color="black"
                  >
                    +
                  </FormLabel>
                  <Input
                    id="filePicker"
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postNewImage(e.target.files[0])}
                    visibility="hidden"
                  ></Input>
                  {/* <label htmlFor="filePicker" style={{ background:"grey", padding:"5px 10px" }}>
My custom choose file label
</label>
<input id="filePicker" style={{visibility:"hidden"}} type={"file"}></input> */}
                </InputLeftElement>
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          color="white"
        ></Box>
      )}
    </>
  );
};

export default SingleChat;
