import { useEffect } from "react";
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
  const basicBoxStyles = {
    boxSize: "550px",
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      history.push("/chats");
      window.location.reload();
    }
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        bg="rgba(1,103,196,0)"
        borderColor="rgba(0,0,0,255)"
        w="100%"
        h="990px"
        p={4}
        m="0 0 15px 1385px"
        borderWidth="1px"
      >
        <Tabs variant="enclosed">
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
