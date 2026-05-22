import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GlobalProvider } from "./context/globalContext.jsx";
import { GlobalStyle } from "./styles/GlobalStyle.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <GlobalStyle />
      <App />
    </GlobalProvider>
  </React.StrictMode>
);
