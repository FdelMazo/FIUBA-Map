import React from "react";
import User from "./User";
import Graph from "./Graph";

export const UserContext = React.createContext<ReturnType<typeof User>>(null!);
export const GraphContext = React.createContext<ReturnType<typeof Graph>>(
  null!,
);

export const MapProvider = ({ children }: React.PropsWithChildren) => {
  const user = User();
  const graph = Graph(user);
  return (
    <UserContext.Provider value={user}>
      <GraphContext.Provider value={graph}>{children}</GraphContext.Provider>
    </UserContext.Provider>
  );
};
