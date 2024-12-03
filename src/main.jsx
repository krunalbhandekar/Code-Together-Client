import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as RTKProvider } from "react-redux";
import store from "./rtk/store";
import App from "./app";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RTKProvider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RTKProvider>
);
