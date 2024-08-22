import React, { PropsWithChildren } from "react";
import User from "./User";
import Graph from "./Graph";
import { UserContextType } from "./types/User";
import { GraphContextType } from "./types/Graph";

// FIXME: hacer type assertion con los contexts quiza no sea la mejor opcion?
// alternativas: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/
export const UserContext = React.createContext<UserContextType>(null!);
export const GraphContext = React.createContext<GraphContextType>(null!);

export const MapProvider = ({ children }: PropsWithChildren) => {
  const user = User();
  const graph = Graph(user);

  return (
    <UserContext.Provider value={user}>
      <GraphContext.Provider value={graph}>{children}</GraphContext.Provider>
    </UserContext.Provider>
  );
};
