import { Box, LightMode, Link, Tag, TagLabel } from "@chakra-ui/react";
import React from "react";

// No estoy particularmente orgulloso de poner ads.
const Ad = () => {
  return (
    <Box top={0} right={0} mt={1} mr={1} position="absolute">
      <LightMode>
        <Link isExternal href="https://prode.click/C00FVBMN">
          <Tag
            size={{ base: "sm", md: "md" }}
            colorScheme="blue"
            fontWeight={600}
          >
            <TagLabel>🎉 prodeclick fiubense 🎉</TagLabel>
          </Tag>
        </Link>
      </LightMode>
    </Box>
  );
};

export default Ad;
