import React from "react";

import { Global } from "@emotion/react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { globalStyles } from "./styled";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Global styles={globalStyles} />
    <App />
  </React.StrictMode>,
);
