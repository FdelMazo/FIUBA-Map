import React, { PropsWithChildren } from "react";
import User from "./User";
import Graph from "./Graph";
import { UserContextType } from "./types/User";
import { GraphContextType } from "./types/Graph";

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
