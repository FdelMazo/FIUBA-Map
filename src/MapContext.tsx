import React from "react";
import User from "./User";
import Graph from "./Graph";
import { UserLogin } from "./types/User";
import { GraphType } from "./types/Graph";

// TODO: fixear esto del context, para que no haya que chequear null cada vez que se usa
export const UserContext = React.createContext<UserLogin | null>(null);
export const GraphContext = React.createContext<GraphType | null>(null);

export const MapProvider = ({ children }) => {
  const user = UserLogin();
  const graph = Graph(user);

  return (
    <UserContext.Provider value={user}>
      <GraphContext.Provider value={graph}>{children}</GraphContext.Provider>
    </UserContext.Provider>
  );
};
