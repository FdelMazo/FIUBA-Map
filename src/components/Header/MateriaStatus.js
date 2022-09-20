import {
  Icon,
} from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Link,
  Stat,
  StatHelpText,
  StatLabel,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { GraphContext, UserContext } from "../../Contexts";

const MateriaStatus = () => {
  const { fiubaRepos, isMobile } =
    React.useContext(UserContext);
  const { getNode, displayedNode } =
    React.useContext(GraphContext);

  const node = React.useMemo(() => getNode(displayedNode), [displayedNode, getNode])
  const repos = React.useMemo(() => fiubaRepos.find(materia => materia.codigos.includes(node?.id.replace('.', ''))), [fiubaRepos, node.id])

  return (
    <Flex>
      {isMobile ? (
        <Text textAlign="center" noOfLines={1} width="100vw" px={8} color="white"><strong>[{node?.id}]</strong> {node?.materia}</Text>
      ) : (
          <Stat color="white" maxWidth="30ch">
            <StatLabel>[{node?.id}]</StatLabel>
          <StatHelpText noOfLines={1}>
            {node?.materia}
          </StatHelpText>
        </Stat>
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
              mx={4}
              alignSelf="center"
              isExternal
              color="white"
              href={`https://fede.dm/FIUBA-Repos?c=${node?.id.replace('.', '')}`}
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
  )
};

export default MateriaStatus;
