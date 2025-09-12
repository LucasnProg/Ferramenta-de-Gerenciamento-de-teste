import React, { useEffect, useState } from "react";
import GlobalStyle from "./styles/global";
import RoutesApp from "./routes";
import { AuthProvider } from "./contexts/auth";

const App = () => {
  localStorage.clear();
  return (
    <AuthProvider>
      <RoutesApp />
      <GlobalStyle />
    </AuthProvider>
  );
}


export default App;