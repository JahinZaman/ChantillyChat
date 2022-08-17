import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TabPanels,
} from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import Signup from "../Components/Authentication/Signup";
import { useHistory } from "react-router-dom";
const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"rgba(58,59,58,255)"}
        borderColor="rgba(58,59,58,255)"
        borderRadius="lg"
        w="100%"
        m="40px 0 15px 0"
        borderWidth="1px"
      >
        <Text
          fontSize="4xl"
          color="rgb(211, 211, 211)"
          textAlign="center"
          fontFamily="Noto Sans"
        >
          Home
        </Text>
      </Box>
      <Box
        bg="rgba(58,59,58,255)"
        borderColor="rgba(58,59,58,255)"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%" color="rgb(211, 211, 211)">
              Login
            </Tab>
            <Tab width="50%" color="rgb(211, 211, 211)">
              Signup
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
