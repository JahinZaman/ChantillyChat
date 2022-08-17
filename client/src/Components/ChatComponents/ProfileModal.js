import React from "react";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
          color="black"
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="30px"
            fontFamily="Noto Sans"
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Image
              JustifyContent="flex-start"
              alignItems="flex-start"
              display="flex"
              borderRadius="full"
              boxSize="100px"
              src={user.pic}
              alt="Profile Picture"
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Noto Sans"
            >
              {user.email}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            justifyContent="center"
            fontSize="30px"
            fontFamily="Noto Sans"
          >
            {user.name}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost"></Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
