import React from "react";
import UserModal from "./UserModal";
import PadronInput from "./PadronInput";
import { Box, Flex, useDisclosure, IconButton } from "@chakra-ui/core";
const UserForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Flex
        align="center"
        justify="space-between"
        padding="0.4rem"
        bg="primary"
        color="secondary"
      >
        <PadronInput />
        <IconButton
          variant="outline"
          variantColor="teal"
          icon="info"
          size="sm"
          onClick={onOpen}
        />
      </Flex>
      <UserModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default UserForm;
