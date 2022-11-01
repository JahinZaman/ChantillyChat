import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast, InputLeftElement } from "@chakra-ui/react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { Icon } from "@chakra-ui/react";
import createBrowserHistory from "history/createBrowserHistory";

const history = createBrowserHistory({ forceRefresh: true });

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill out all  Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      // console.log(JSON.stringify(data));
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px" color="lightgrey">
      <FormControl id="email" flexDir="row" isRequired>
        <InputGroup size="lg" mt={2}>
          <Input
            borderLeft="none"
            borderRight="none"
            borderTop="none"
            value={email}
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputLeftElement h="50px" width="50px">
            <Icon as={FaEnvelope} />
          </InputLeftElement>
        </InputGroup>
      </FormControl>
      <FormControl flexDirection="row" id="password" isRequired>
        <InputGroup size="lg" mt={2}>
          <InputLeftElement h="50px" width="50px">
            <Icon as={FaLock} />
          </InputLeftElement>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        rightIcon={<ArrowRightIcon />}
        bg="rgba(255,255,255,0)"
        borderColor="white"
        borderWidth="1px"
        width="100%"
        style={{ marginTop: 20 }}
        onClick={submitHandler}
        isLoading={loading}
      ></Button>
    </VStack>
  );
};

export default Login;
