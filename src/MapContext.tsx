import React, { PropsWithChildren } from "react";
import User from "./User";
import Graph from "./Graph";
import { UserLogin } from "./types/User";
import { GraphType } from "./types/Graph";

// FIXME: hacer type assertion con los contexts quiza no sea la mejor opcion?
// alternativas: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/
export const UserContext = React.createContext<UserLogin>(null!);
export const GraphContext = React.createContext<GraphType>(null!);

export const MapProvider = ({ children }: PropsWithChildren) => {
  const user = User();
  const graph = Graph(user);

  return (
    <UserContext.Provider value={user}>
      <GraphContext.Provider value={graph}>{children}</GraphContext.Provider>
    </UserContext.Provider>
  );
};
