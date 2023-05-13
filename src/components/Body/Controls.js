import {
  ChatIcon,
  CheckIcon,
  ExternalLinkIcon,
  Icon,
  MoonIcon,
  QuestionIcon,
  SunIcon,
} from "@chakra-ui/icons";
import {
  LightMode,
  Tag,
  TagLabel,
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  CloseButton,
  DarkMode,
  Flex,
  IconButton,
  Link,
  TagRightIcon,
  Text,
  Textarea,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { UserContext } from "../../Contexts";

const Controls = () => {
  const { submitBug, isMobile } = React.useContext(UserContext);
  const toast = useToast();
  const bugToast = React.useRef();
  const [showGracias, setShowGracias] = React.useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      textAlign="right"
      bottom={0}
      right={0}
      mb={2}
      mr={2}
      position="absolute"
      color={useColorModeValue("text", "textdark")}
    >
      <Tooltip placement="top" label={`${useColorModeValue("Dark", "Light")} theme`}>
        <Link onClick={toggleColorMode}>
          {useColorModeValue(<MoonIcon boxSize={isMobile ? 4 : 5} />, <SunIcon boxSize={isMobile ? 4 : 5} />)}
        </Link>
      </Tooltip>
      <Tooltip placement="top" label="alejorodriguez96/PSICO-UNLP-Map">
        <Link
          isExternal
          href="https://github.com/alejorodriguez96/PSICO-UNLP-Map"
        >
          <Icon boxSize={isMobile ? 4 : 5} ml={isMobile ? 1 : 2} viewBox="0 0 16 16">
            <path
              fill="currentColor"
              d="M7.999,0.431c-4.285,0-7.76,3.474-7.76,7.761 c0,3.428,2.223,6.337,5.307,7.363c0.388,0.071,0.53-0.168,0.53-0.374c0-0.184-0.007-0.672-0.01-1.32 c-2.159,0.469-2.614-1.04-2.614-1.04c-0.353-0.896-0.862-1.135-0.862-1.135c-0.705-0.481,0.053-0.472,0.053-0.472 c0.779,0.055,1.189,0.8,1.189,0.8c0.692,1.186,1.816,0.843,2.258,0.645c0.071-0.502,0.271-0.843,0.493-1.037 C4.86,11.425,3.049,10.76,3.049,7.786c0-0.847,0.302-1.54,0.799-2.082C3.768,5.507,3.501,4.718,3.924,3.65 c0,0,0.652-0.209,2.134,0.796C6.677,4.273,7.34,4.187,8,4.184c0.659,0.003,1.323,0.089,1.943,0.261 c1.482-1.004,2.132-0.796,2.132-0.796c0.423,1.068,0.157,1.857,0.077,2.054c0.497,0.542,0.798,1.235,0.798,2.082 c0,2.981-1.814,3.637-3.543,3.829c0.279,0.24,0.527,0.713,0.527,1.437c0,1.037-0.01,1.874-0.01,2.129 c0,0.208,0.14,0.449,0.534,0.373c3.081-1.028,5.302-3.935,5.302-7.362C15.76,3.906,12.285,0.431,7.999,0.431z"
            />
          </Icon>
        </Link>
      </Tooltip>
      <Tooltip placement="top" label="Invitame un Cafecito">
        <Link
          isExternal
          href="https://cafecito.app/alejorodriguez96"
        >
          <Icon boxSize={isMobile ? 4 : 5} ml={isMobile ? 1 : 2} viewBox="0 0 512 512">
            <path
              fill="currentColor"
              d="M127.1 146.5c1.3 7.7 8 13.5 16 13.5h16.5c9.8 0 17.6-8.5 16.3-18-3.8-28.2-16.4-54.2-36.6-74.7-14.4-14.7-23.6-33.3-26.4-53.5C111.8 5.9 105 0 96.8 0H80.4C70.6 0 63 8.5 64.1 18c3.9 31.9 18 61.3 40.6 84.4 12 12.2 19.7 27.5 22.4 44.1zm112 0c1.3 7.7 8 13.5 16 13.5h16.5c9.8 0 17.6-8.5 16.3-18-3.8-28.2-16.4-54.2-36.6-74.7-14.4-14.7-23.6-33.3-26.4-53.5C223.8 5.9 217 0 208.8 0h-16.4c-9.8 0-17.5 8.5-16.3 18 3.9 31.9 18 61.3 40.6 84.4 12 12.2 19.7 27.5 22.4 44.1zM400 192H32c-17.7 0-32 14.3-32 32v192c0 53 43 96 96 96h192c53 0 96-43 96-96h16c61.8 0 112-50.2 112-112s-50.2-112-112-112zm0 160h-16v-96h16c26.5 0 48 21.5 48 48s-21.5 48-48 48z"
            />
          </Icon>
        </Link>
      </Tooltip>
      <LightMode>
        <Box>
          <Tag
            mt={2}
            size={isMobile ? "sm" : "md"}
            variant="subtle"
            cursor="pointer"
            bg="#e9eaeb"
            onClick={() => {
              toast.close(bugToast.current);
              return (bugToast.current = toast({
                render: (props) => (
                  <Alert
                    borderRadius={6}
                    p={6}
                    mb="4em"
                    borderColor={
                      colorMode === "dark" ? "electivas.400" : "electivas.500"
                    }
                    borderWidth={2}
                    bg={colorMode === "dark" ? "gray.700" : "gray.50"}
                    color={colorMode === "dark" ? "textdark" : "text"}
                  >
                    <Box flex="1">
                      <AlertTitle mb={2}>Hola!</AlertTitle>
                      <AlertDescription px={5} display="block">
                        <VStack spacing={2}>
                          <Text>
                            Este proyecto surge a partir de 
                            <Link
                              isExternal
                              _hover={{
                                color:
                                  colorMode === "dark"
                                    ? "electivas.400"
                                    : "electivas.500",
                              }}
                              href="https://fede.dm/FIUBA-Map/"
                            >
                              {" "}FIUBA-Map{" "}
                              <ExternalLinkIcon
                                color={
                                  colorMode === "dark"
                                    ? "electivas.400"
                                    : "electivas.500"
                                }
                              />
                            </Link>
                            , creado para mostrar de forma interactiva los planes de estudio de la Facultad de Ingeniería de la UBA. 
                            Fue creado por 
                            <Link
                              isExternal
                              _hover={{
                                color:
                                  colorMode === "dark"
                                    ? "electivas.400"
                                    : "electivas.500",
                              }}
                              href="https://fede.dm/"
                            >
                              {" "}FdelMazo{" "}
                              <ExternalLinkIcon
                                color={
                                  colorMode === "dark"
                                    ? "electivas.400"
                                    : "electivas.500"
                                }
                              />
                            </Link>

                            {" "}
                          </Text>
                        <Text>
                            Más adelante completaré esta sección con una breve introducción al funcionamiento de la app. 
                        </Text>
                        <Text>
                            Falta agregar muchas cosas aún, pero por ahora lo principal es que la app funcione como herramienta de consulta del plan de estudios y del avance en la carrera.
                        </Text>
                          <Text>
                            Espero te sea util!
                          </Text>
                        </VStack>
                        <form
                          onSubmit={(t) => {
                            t.preventDefault();
                            submitBug(t.target.elements["bug"].value);
                            setShowGracias(true);
                            toast.close(bugToast.current);
                          }}
                        >
                          <Flex mt={3} alignItems="flex-end">
                            <Textarea
                              resize="none"
                              borderColor={
                                colorMode === "dark" ? "textdark" : "text"
                              }
                              color={
                                colorMode === "dark" ? "textdark" : "text"
                              }
                              focusBorderColor={
                                colorMode === "dark"
                                  ? "electivas.400"
                                  : "electivas.500"
                              }
                              size="sm"
                              name="bug"
                            />
                            <DarkMode>
                              <IconButton
                                ml={3}
                                colorScheme="purple"
                                size="sm"
                                type="submit"
                                icon={<ChatIcon />}
                              />
                            </DarkMode>
                          </Flex>
                        </form>
                      </AlertDescription>
                    </Box>
                    <CloseButton
                      color={
                        colorMode === "dark"
                          ? "electivas.400"
                          : "electivas.500"
                      }
                      onClick={() => toast.close(props.id)}
                      position="absolute"
                      right="8px"
                      top="8px"
                    />
                  </Alert>
                ),
                status: "info",
                position: "bottom",
                duration: null,
                isClosable: true,
              }));
            }}
          >
            <TagLabel>{showGracias ? "Gracias!" : "Qué es esto?"}</TagLabel>
            <TagRightIcon as={showGracias ? CheckIcon : QuestionIcon} />
          </Tag>
        </Box>
      </LightMode>
    </Box>
  )
};

export default Controls;
