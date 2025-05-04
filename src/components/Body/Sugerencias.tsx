import { ChatIcon, CheckIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  CloseButton,
  DarkMode,
  Flex,
  IconButton,
  LightMode,
  Link,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  Textarea,
  VStack,
  useToast,
  ToastId,
} from "@chakra-ui/react";
import React from "react";
import { UserContext } from "../../MapContext";
import { submitBug } from "../../dbutils";

// Toast para reportar bugs
const Sugerencias = () => {
  const { user } = React.useContext(UserContext);
  const bugToast = React.useRef<ToastId | undefined>();
  const [showGracias, setShowGracias] = React.useState(false);
  const toast = useToast();

  return (
    <LightMode>
      <Box>
        <Tag
          mt={2}
          size={{ base: "sm", md: "md" }}
          variant="subtle"
          cursor="pointer"
          bg="#e9eaeb"
          onClick={() => {
            if (bugToast.current && toast.isActive(bugToast.current)) {
              toast.close(bugToast.current);
              return;
            }

            return (bugToast.current = toast({
              status: "info",
              position: "bottom",
              duration: null,
              isClosable: true,
              render: (props) => (
                <Alert
                  borderRadius={6}
                  p={6}
                  mb="4em"
                  borderWidth={2}
                  _light={{
                    bg: "gray.50",
                    borderColor: "electivas.500",
                    color: "text",
                  }}
                  _dark={{
                    bg: "gray.700",
                    borderColor: "electivas.400",
                    color: "textdark",
                  }}
                >
                  <Box flex="1">
                    <AlertTitle mb={2}>Hola!</AlertTitle>
                    <AlertDescription px={5} display="block">
                      <VStack spacing={2}>
                        <Text w="100%">
                          Por más que algún día
                          <Link
                            isExternal
                            _hover={{
                              _light: {
                                color: "electivas.500",
                              },
                              _dark: {
                                color: "electivas.400",
                              },
                            }}
                            href="https://status.fede.dm"
                          >
                            {" "}
                            me voy a recibir{" "}
                            <ExternalLinkIcon
                              _light={{
                                color: "electivas.500",
                              }}
                              _dark={{
                                color: "electivas.400",
                              }}
                            />
                          </Link>{" "}
                          y dejar de agregar funcionalidades nuevas al proyecto,
                          los <em>bugs</em> críticos los voy a seguir
                          arreglando.
                        </Text>
                        <Text w="100%">
                          Así que si encontrás algo que no funciona, avisame!
                        </Text>
                        <Text w="100%">
                          Más alla de eso, gracias por usar la herramienta!
                          Espero que te haya servido.
                          <Link
                            isExternal
                            _hover={{
                              _light: {
                                color: "electivas.500",
                              },
                              _dark: {
                                color: "electivas.400",
                              },
                            }}
                            href="https://cafecito.app/FdelMazo"
                          >
                            {" "}
                            Si me querés tirar un cafecito{" "}
                            <ExternalLinkIcon
                              _light={{
                                color: "electivas.500",
                              }}
                              _dark={{
                                color: "electivas.400",
                              }}
                            />
                          </Link>{" "}
                          , te lo agradezco mucho!
                          <br />
                          <Text fontSize="xs">
                            (Aunque para ser sincero, aprecio más los mensajes
                            que los cafecitos...)
                          </Text>
                        </Text>
                      </VStack>
                      <form
                        onSubmit={async (t) => {
                          t.preventDefault();
                          const bugTextArea =
                            t.currentTarget.elements.namedItem(
                              "bug",
                            ) as HTMLTextAreaElement;
                          await submitBug(user, bugTextArea.value).catch(
                            console.error,
                          );
                          setShowGracias(true);
                          if (bugToast.current) {
                            toast.close(bugToast.current);
                          }
                        }}
                      >
                        <Flex mt={3} alignItems="flex-end">
                          <Textarea
                            resize="none"
                            _light={{
                              focusBorderColor: "electivas.500",
                              borderColor: "text",
                              color: "text",
                            }}
                            _dark={{
                              focusBorderColor: "electivas.400",
                              borderColor: "textdark",
                              color: "textdark",
                            }}
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
                              aria-label="Enviar sugerencia"
                            />
                          </DarkMode>
                        </Flex>
                      </form>
                      <Text fontSize="sm" mt={2}>
                        ¿Usás GitHub? Me ayudás mucho más{" "}
                        <Link
                          isExternal
                          _hover={{
                            _light: {
                              color: "electivas.500",
                            },
                            _dark: {
                              color: "electivas.400",
                            },
                          }}
                          href="https://github.com/FdelMazo/FIUBA-Map/issues/new"
                        >
                          levantando un <em>issue</em> directamente.{" "}
                          <ExternalLinkIcon
                            _light={{
                              color: "electivas.500",
                            }}
                            _dark={{
                              color: "electivas.400",
                            }}
                            mx="2px"
                          />
                        </Link>
                      </Text>
                    </AlertDescription>
                  </Box>
                  <CloseButton
                    _light={{
                      color: "electivas.500",
                    }}
                    _dark={{
                      color: "electivas.400",
                    }}
                    onClick={() => props.id && toast.close(props.id)}
                    position="absolute"
                    right="8px"
                    top="8px"
                  />
                </Alert>
              ),
            }));
          }}
        >
          <TagLabel>{showGracias ? "Gracias!" : "Sugerencias"}</TagLabel>
          <TagRightIcon as={showGracias ? CheckIcon : ChatIcon} />
        </Tag>
      </Box>
    </LightMode>
  );
};

export default Sugerencias;
