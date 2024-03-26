import React from "react";
import User from "./User";
import Graph from "./Graph";

export const UserContext = React.createContext();
export const GraphContext = React.createContext();

export const MapProvider = ({ children }) => {
  const user = User();
  const graph = Graph(user);
  
  return (
    <UserContext.Provider value={user}>
      <GraphContext.Provider value={graph}>{children}</GraphContext.Provider>
    </UserContext.Provider>
  );
};
