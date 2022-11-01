import { Button } from "@chakra-ui/button";
import { Icon } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast, InputLeftElement } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import createBrowserHistory from "history/createBrowserHistory";
import { FaEnvelope, FaLock, FaUserAlt, FaRegImage } from "react-icons/fa";
import { ArrowRightIcon } from "@chakra-ui/icons";
const history = createBrowserHistory({ forceRefresh: true });

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
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
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
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
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
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
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return (
    <VStack spacing="5px" color="lightgrey">
      <FormControl id="first-name" flexDir="row" isRequired>
        <InputGroup size="lg" mt={2}>
          <Input
            placeholder="Name"
            borderLeft="none"
            borderRight="none"
            borderTop="none"
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          <InputLeftElement h="50px" width="50px">
            <Icon as={FaUserAlt} />
          </InputLeftElement>
        </InputGroup>
      </FormControl>

      <FormControl id="email" isRequired>
        <InputGroup size="lg" mt={2}>
          <Input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputLeftElement h="50px" width="50px">
            <Icon as={FaEnvelope} />
          </InputLeftElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <InputGroup size="lg" mt={2}>
          <InputLeftElement h="50px" width="50px">
            <Icon as={FaLock} />
          </InputLeftElement>
          <Input
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem" color="black">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <InputGroup size="lg" mt={2}>
          <InputLeftElement h="50px" width="50px">
            <Icon as={FaLock} />
          </InputLeftElement>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem" color="black">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <InputGroup size="lg" mt={2}>
          <InputRightElement h="50px" width="50px">
            <Icon as={FaRegImage} w={8} h={8} />
          </InputRightElement>
          <Input
            id="filePicker"
            type="file"
            p={1.5}
            placeholder="Profile Picture"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />

          <InputLeftElement h="50px" w="50px"></InputLeftElement>
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
        isLoading={picLoading}
      ></Button>
    </VStack>
  );
};

export default Signup;
