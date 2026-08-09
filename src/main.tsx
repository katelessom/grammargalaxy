import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./page";
import "./style.css";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
);
