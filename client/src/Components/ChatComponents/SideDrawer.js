import React, { useState } from "react";
import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const history = useHistory();
  const toast = useToast();
  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (!search) {
      toast({
        title: "Please Enter Something",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to retrieve search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        bg="#36393f"
        alignItems="center"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        borderColor="#36393f"
      >
        <Tooltip
          label="Search Friends to chat with!"
          hasArrow
          placement="bottom-end"
        >
          <Button variant="ghost" onClick={onOpen}>
            <i class="fas fa-search" color=""></i>
            <Text display={{ base: "none", md: "flex" }} color="#cfddde" px="4">
              Search
            </Text>
          </Button>
        </Tooltip>
        <Text size="2xl" fontFamily="Noto Sans">
          <div>
            <Menu>
              <MenuButton p={1}>
                <NotificationBadge
                  count={notification.length}
                  effect={Effect.SCALE}
                />
                <BellIcon fontSize="2xl" m={1}></BellIcon>
              </MenuButton>
              <MenuList textAlign="center">
                {!notification.length && "No New Messages"}
                {notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={user.name}
                  src={user.pic}
                />
              </MenuButton>
              <MenuList>
                <ProfileModal user={user}>
                  <MenuItem>My Profile</MenuItem>
                </ProfileModal>
                <MenuDivider></MenuDivider>
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </Text>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search"
                mr={2}
                value={search}
                onChange={handleSearch}
              ></Input>
              <Button>
                <i class="fas fa-search" color=""></i>
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
