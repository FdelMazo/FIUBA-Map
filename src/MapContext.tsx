import React from "react";
import User from "./User";
import Graph from "./Graph";
import { UserType } from "./types/UserType";
import { GraphType } from "./types/Graph";

// TODO: fixear esto del context, para que no haya que chequear null cada vez que se usa
export const UserContext = React.createContext<UserType | null>(null);
export const GraphContext = React.createContext<GraphType | null>(null);

export const MapProvider = ({ children }) => {
  const user = User();
  const graph = Graph(user);

  return (
    <UserContext.Provider value={user}>
      <GraphContext.Provider value={graph}>{children}</GraphContext.Provider>
    </UserContext.Provider>
  );
};
