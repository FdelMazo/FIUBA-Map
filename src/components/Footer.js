import React from "react";
import { Grid, Progress } from "@chakra-ui/core";
import UserContext from "../UserContext";

const Footer = () => {
  const { logged } = React.useContext(UserContext);
  return (
    <React.Fragment>
      {logged && (
        <Grid templateColumns="repeat(5, 1fr)" gap={0}>
          <Progress value={100} />
          <Progress value={80} color="pink" />
        </Grid>
      )}
    </React.Fragment>
  );
};

export default Footer;
