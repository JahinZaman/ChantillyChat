import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import SideDrawer from "../Components/ChatComponents/SideDrawer";
import MyChats from "../Components/ChatComponents/MyChats";
import { ChatState } from "../Context/ChatProvider";
import ChatBox from "../Components/ChatComponents/ChatBox";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        color="white"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
