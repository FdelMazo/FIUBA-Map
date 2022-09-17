import {
  AddIcon,
  CheckIcon,
  CloseIcon,
  Icon,
  MinusIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stat,
  StatHelpText,
  StatLabel,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../Contexts";
import useWindowSize from "../useWindowSize";

const MateriaMenu = () => {
  const { fiubaRepos } =
    React.useContext(UserContext);
  const { getNode, aprobar, displayedNode, desaprobar, cursando, getCurrentCuatri } =
    React.useContext(GraphContext);
  const { isMobile } = useWindowSize();

  const reposCodigo = displayedNode.replace('.', '')
  const repos = fiubaRepos.find(materia => materia.codigos.includes(reposCodigo))

  const flechitas = React.useCallback(
    (event) => {
      const node = getNode(displayedNode)
      if (event.key === "ArrowLeft") {
        if (getNode(displayedNode).categoria === "*CBC") return
        const prevCuatri = node.cuatrimestre ? node.cuatrimestre - 0.5 : getCurrentCuatri();
        cursando(displayedNode, prevCuatri);
      }
      if (event.key === "ArrowRight") {
        if (getNode(displayedNode).categoria === "*CBC") return
        const nextCuatri = node.cuatrimestre ? node.cuatrimestre + 0.5 : getCurrentCuatri();
        cursando(displayedNode, nextCuatri);
      }
      if (event.key === "ArrowUp") {
        let nextNota = node.nota + 1;
        if (node.nota === 0) nextNota = 4;
        if (node.nota === 10) {
          desaprobar(displayedNode)
          return
        };
        aprobar(displayedNode, nextNota)
      }
      if (event.key === "ArrowDown") {
        let prevNota = node.nota - 1;
        if (node.nota === 4) prevNota = 0;
        if (node.nota === -2) prevNota = 10;
        if (node.nota === -1) {
          desaprobar(displayedNode)
          return
        };
        aprobar(displayedNode, prevNota)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedNode]
  );

  const numeros = React.useCallback(
    (event) => {
      const n = parseInt(event.key)
      if (n >= 4 && n <= 9) {
        aprobar(displayedNode, n);
      }
      if (n === 0) {
        aprobar(displayedNode, 10);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedNode]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", flechitas, false);
    document.addEventListener("keydown", numeros, false);

    return () => {
      document.removeEventListener("keydown", flechitas, false);
      document.removeEventListener("keydown", numeros, false);
    };
  }, [flechitas, numeros]);



  const formatCuatri = (cuatristr) => {
    if (!cuatristr) return "/";
    const cuatri = parseFloat(cuatristr)
    if (cuatri % 1 === 0) return `${cuatri}C1`;
    return `${Math.floor(cuatri)}C2`;
  };

  const parseCuatri = (cuatristr) => {
    if (cuatristr === "/") return undefined;
    const [y, c] = cuatristr.split("C");
    if (c === "1") return y;
    return y + 0.5;
  }

  return (
    <>
      <Flex width={isMobile ? "100%" : "undefined"} alignItems="center" justifyContent="space-around" flexWrap="wrap">
        {isMobile ? (
          <Text textAlign="center" alignSelf="flex-end" m={2} isTruncated width={"100%"} color="white"><strong>[{getNode(displayedNode)?.id}]</strong> {getNode(displayedNode)?.materia}</Text>
        ) : (
          <Stat alignSelf="flex-end" mx={3} color="white">
            <StatLabel>[{getNode(displayedNode)?.id}]</StatLabel>
            <StatHelpText isTruncated width={"30ch"}>
              {getNode(displayedNode)?.materia}
            </StatHelpText>
          </Stat>
        )}

        <Flex borderRadius={6} border="2px solid white" alignItems="center" height={"75%"}>
          {getNode(displayedNode)?.nota > 0 ? (
            <>
              <Tooltip closeOnClick hasArrow label="Nota">
                <NumberInput
                  css={{ margin: 0 }}
                  errorBorderColor="transparent"
                  borderColor="transparent"
                  inputMode="numeric"
                  onChange={(_, nota) => {
                    aprobar(displayedNode, nota);
                  }}
                  value={getNode(displayedNode)?.nota}
                  min={4}
                  max={10}
                  maxW="4.5rem"
                  onFocus={(ev) => {
                    ev.target.blur()
                  }}
                >
                  <NumberInputField
                    _hover={{
                      borderColor: "transparent",
                    }}
                    _focus={{
                      borderColor: "transparent",
                    }}
                    color="white"
                    fontWeight="bold"
                  />
                  <NumberInputStepper mr={1}>
                    <NumberIncrementStepper
                      border="none"
                      fontSize="small"
                      color="green.500"
                    />
                    <NumberDecrementStepper
                      border="none"
                      fontSize="small"
                      color="red.500"
                    />
                  </NumberInputStepper>
                </NumberInput>
              </Tooltip>
              <Tooltip closeOnClick hasArrow label="Aprobar por Equivalencia">
                <Button
                  alignSelf="center"
                  _hover={{
                    backgroundColor: "transparent",
                  }}
                  variant="link"
                  fontSize="small"
                  color="aprobadas.400"
                  minW={0}
                  mr={2}
                  onClick={() => aprobar(displayedNode, 0)}
                >
                  <strong>E</strong>
                </Button>
              </Tooltip>
            </>
          ) : (
            <Tooltip closeOnClick hasArrow label="Aprobar">
              <Button
                _hover={{
                  backgroundColor: "transparent",
                }}
                borderRadius="0"
                variant="link"
                fontSize="larger"
                color="green.500"
                onClick={() => aprobar(displayedNode, 4)}
              >
                <CheckIcon />
              </Button>
            </Tooltip>
          )}

          <Tooltip closeOnClick hasArrow label="Desaprobar">
            <Button
              _hover={{
                backgroundColor: "transparent",
              }}
              borderRadius="0"
              variant="link"
              borderLeft="2px solid white"
              borderRight="2px solid white"
              color="red.500"
              onClick={() => desaprobar(displayedNode)}
            >
              <CloseIcon />
            </Button>
          </Tooltip>

          <Tooltip closeOnClick hasArrow label="Poner en Final">
            <Button
              _hover={{
                backgroundColor: "transparent",
              }}
              borderRadius="0"
              variant="link"
              fontSize="larger"
              color="yellow.300"
              onClick={() => aprobar(displayedNode, -1)}
            >
              <strong>F</strong>
            </Button>
          </Tooltip>
        </Flex>

        {getNode(displayedNode).categoria !== "CBC" && getNode(displayedNode).categoria !== "*CBC" && (
          <>
            {!getNode(displayedNode).cuatrimestre ?
              (
                <Tooltip closeOnClick hasArrow label="Planear Cuatrimestre">
                  <Button
                    _hover={{
                      backgroundColor: "transparent",
                    }}
                    height={"68%"}
                    ml={4}
                    borderRadius={6}
                    border="2px solid white"
                    variant="link"
                    fontSize="larger"
                    color="habilitadas.500"
                    onClick={() => cursando(displayedNode, getCurrentCuatri())}
                  >
                    <strong>C</strong>
                  </Button>
                </Tooltip>
              )
              :
              (
                <HStack borderRadius={6} ml={4} border="2px solid white" height={"68%"}>
                  <Tooltip closeOnClick hasArrow label="Cuatrimestre">
                    <NumberInput
                      css={{ margin: 0 }}
                      errorBorderColor="white.500"
                      borderColor="transparent"
                      onChange={(_, cuatri) => {
                        cursando(displayedNode, cuatri);
                      }}
                      value={getNode(displayedNode)?.cuatrimestre}
                      format={formatCuatri}
                      parse={parseCuatri}
                      step={0.5}
                      precision={1}
                      key={getNode(displayedNode)?.cuatrimestre}
                      onFocus={(ev) => {
                        ev.target.blur()
                      }}
                    >
                      <NumberInputField
                        _hover={{
                          borderColor: "transparent",
                        }}
                        _focus={{
                          borderColor: "transparent",
                        }}
                        p={0}
                        ml={2}
                        w="10ch"
                        color="white"
                        fontWeight="bold"
                        cursor="default"
                      />
                      <NumberInputStepper height="100%" m={0}>
                        <NumberIncrementStepper
                          my="2px"
                          border="none"
                          color="white"
                          alignSelf={"center"}
                          _hover={{
                            color: "habilitadas.500"
                          }}
                          children={<AddIcon boxSize={3.5} />}
                        />
                        <NumberDecrementStepper
                          my="2px"
                          border="none"
                          color="grey"
                          alignSelf={"center"}
                          _hover={{
                            color: "habilitadas.500"
                          }}
                          children={<MinusIcon boxSize={3.5} />}
                        />
                      </NumberInputStepper>
                    </NumberInput>
                  </Tooltip>

                  <Tooltip closeOnClick hasArrow label="Limpiar">
                    <Button
                      _hover={{
                        backgroundColor: "transparent",
                        color: "habilitadas.500"
                      }}
                      borderRadius="0"
                      cursor="pointer"
                      variant="link"
                      borderLeft="2px solid white"
                      fontSize="larger"
                      color="white"
                      disabled={!getNode(displayedNode)?.cuatrimestre}
                      onClick={() => cursando(displayedNode, undefined)}
                    >
                      <Icon boxSize={5} viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12.2071 2.29289C12.5976 2.68342 12.5976 3.31658 12.2071 3.70711L10.9142 5H12.5C17.1523 5 21 8.84772 21 13.5C21 18.1523 17.1523 22 12.5 22C7.84772 22 4 18.1523 4 13.5C4 12.9477 4.44772 12.5 5 12.5C5.55228 12.5 6 12.9477 6 13.5C6 17.0477 8.95228 20 12.5 20C16.0477 20 19 17.0477 19 13.5C19 9.95228 16.0477 7 12.5 7H10.9142L12.2071 8.29289C12.5976 8.68342 12.5976 9.31658 12.2071 9.70711C11.8166 10.0976 11.1834 10.0976 10.7929 9.70711L7.79289 6.70711C7.40237 6.31658 7.40237 5.68342 7.79289 5.29289L10.7929 2.29289C11.1834 1.90237 11.8166 1.90237 12.2071 2.29289Z"
                        />
                      </Icon>

                    </Button>
                  </Tooltip>
                </HStack>
              )
            }
          </>
        )}

        {!isMobile && repos && (
          <>
            <Tooltip closeOnClick hasArrow label={
              <Box textAlign="center">
                <Text>
                  Chusmeá {repos.reponames.size === 1 ? 'el FIUBA-Repo' : `los ${repos.reponames.size} FIUBA-Repos`}
                </Text>
                <Text>
                  de esta materia!
                </Text>
              </Box>

            }>
              <Link
                isExternal
                ml={8}
                color="white"
                href={`https://fede.dm/FIUBA-Repos?c=${reposCodigo}`}
              >

                <Icon boxSize={5} viewBox="0 0 16 16">
                  <path
                    fill="currentColor"
                    d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
                  />
                </Icon>
              </Link>
            </Tooltip>
          </>
        )}

      </Flex>
    </>
  );
};

export default MateriaMenu;
