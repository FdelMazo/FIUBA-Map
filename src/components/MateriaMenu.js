import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext } from "../Contexts";

const Header = (props) => {
  const { displayedNode } = props;
  const { nodeFunctions } = React.useContext(GraphContext);
  const { getNode } = nodeFunctions;

  return (
    <HStack justify-content="space-between" spacing={10}>
      <>
        [{getNode(displayedNode).id}] {getNode(displayedNode).materia}
      </>
      <NumberInput defaultValue={4} min={4} max={10}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Popover trigger="hover">
        <PopoverTrigger>
          <Box>
            <IconButton icon={<AddIcon />}></IconButton>
          </Box>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader size="sm" fontWeight="semibold" color="primary">
            Aprobar
          </PopoverHeader>
          <PopoverArrow />
        </PopoverContent>
      </Popover>
      <Popover trigger="hover">
        <PopoverTrigger>
          <IconButton icon={<MinusIcon />}></IconButton>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader size="sm" fontWeight="semibold" color="primary">
            Desaprobar
          </PopoverHeader>
          <PopoverArrow />
        </PopoverContent>
      </Popover>
      <Popover trigger="hover">
        <PopoverTrigger>
          <Button>F</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader size="sm" fontWeight="semibold" color="primary">
            Poner en Final
          </PopoverHeader>
          <PopoverArrow />
        </PopoverContent>
      </Popover>
    </HStack>
  );
};

export default Header;
