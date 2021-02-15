import { SmallAddIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Progress,
  SimpleGrid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";
import React from "react";
import * as C from "../constants";
import { GraphContext, UserContext } from "../Contexts";
const Footer = () => {
  const { logged } = React.useContext(UserContext);
  const { graph, toggleGroup } = React.useContext(GraphContext);

  return (
    <>
      <Stack w="fit-content" mb={5} ml={2}>
        {graph.groups
          .filter((c) => c !== "CBC" && c !== "Materias Obligatorias")
          .map((c) => (
            <Tag
              cursor="pointer"
              size="md"
              color="black"
              bg={C.GRUPOS[c].color}
              borderRadius="full"
              onClick={() => {
                toggleGroup(c);
              }}
            >
              <TagLeftIcon boxSize="12px" as={SmallAddIcon} />
              <TagLabel>{c}</TagLabel>
            </Tag>
          ))}
      </Stack>

      {!logged && (
        <Flex alignItems="center" bg="primary" bottom="0" position="sticky">
          <SimpleGrid
            px={5}
            flexGrow={1}
            ml={5}
            columns={graph.groups.filter((c) => c !== "CBC").length}
            gap={0}
          >
            {graph.groups
              .filter((c) => c !== "CBC")
              .map((c) => (
                <Popover placement="top">
                  <PopoverTrigger>
                    <Box>
                      <Progress
                        css={{
                          "& *": { backgroundColor: C.GRUPOS[c].color },
                        }}
                        value={100}
                      />
                    </Box>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>{c}</PopoverHeader>
                    <PopoverBody>
                      Tenes x de y creditos necesarios para recibirte
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              ))}
          </SimpleGrid>
          <Box>
            <Stat
              p="0.4rem"
              color="white"
              css={{ "& *": { marginTop: 0, marginBottom: 0 } }}
              size="sm"
            >
              <StatLabel>Promedio</StatLabel>
              <StatNumber>9.50</StatNumber>
            </Stat>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default Footer;
