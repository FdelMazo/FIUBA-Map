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
} from "@chakra-ui/react";
import React from "react";
import { UserContext } from "../../MapContext";
import { submitBug } from "../../dbutils";

// Toast para reportar bugs
const Sugerencias = () => {
  const { user } = React.useContext(UserContext);
  const bugToast = React.useRef();
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
            if (toast.isActive(bugToast.current)) {
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
                        <Text>
                          Este proyecto ya cumplió su ciclo... las últimas
                          actualizaciones que hubo que hacer (Plan 2020)
                          terminaron de quemarme. Sin hablar de que algún día
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
                          y quiero dejar esto de lado.
                        </Text>
                        <Text>
                          Actualmente mucho no hay para hacer, pero
                          eventualmente van a salir más planes nuevos y voy a
                          necesitar ayuda. Si te interesa, deja un comentario{" "}
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
                            href="https://github.com/FdelMazo/FIUBA-Map/issues/168"
                          >
                            {" "}
                            acá.{" "}
                            <ExternalLinkIcon
                              _light={{
                                color: "electivas.500",
                              }}
                              _dark={{
                                color: "electivas.400",
                              }}
                            />
                          </Link>
                        </Text>
                        <Text>
                          Más allá de eso, todo lo que sea un bug crítico lo voy
                          a seguir arreglando, así que si encontrás algo que no
                          funciona, avisame!
                        </Text>
                        <Text>
                          Y si llegaste tan lejos, gracias por usar la
                          herramienta! Espero que te haya servido. Si me querés
                          tirar un cafecito, te lo agradezco mucho!
                          <br />
                          <Text fontSize="xs" as="span">
                            {" "}
                            (Aunque para ser sincero, aprecio más los mensajes
                            que los cafecitos...)
                          </Text>
                        </Text>
                      </VStack>
                      <form
                        onSubmit={async (t) => {
                          t.preventDefault();
                          await submitBug(
                            user,
                            t.target.elements["bug"].value,
                          ).catch(console.error);
                          setShowGracias(true);
                          toast.close(bugToast.current);
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
                            />
                          </DarkMode>
                        </Flex>
                      </form>
                      <Text fontSize="sm" mt={2}>
                        ¿Usás Github? Me ayudás mucho más levantando un issue{" "}
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
                          directamente{" "}
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
                    onClick={() => toast.close(props.id)}
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
