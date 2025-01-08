import React from "react";
import User from "./User";
import Graph from "./Graph";
import { UserType } from "./types/User";
import { GraphType } from "./types/Graph";

export const UserContext = React.createContext<UserType.Context>(null!);
export const GraphContext = React.createContext<GraphType.Context>(null!);

export const MapProvider = ({ children }: React.PropsWithChildren) => {
  const user = User();
  const graph = Graph(user);
  return (
    <UserContext.Provider value={user}>
      <GraphContext.Provider value={graph}>{children}</GraphContext.Provider>
    </UserContext.Provider>
  );
};
