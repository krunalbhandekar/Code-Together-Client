import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import "./index.css";
import App from "./App";
import store from "./rtk/store";
import { setSessionExpiredHandler } from "./lib/api";
import { applySession } from "./lib/session";
import { onLogout } from "./rtk/auth/action";

// Restore a saved login before the first render, so the API client and socket
// are ready when components mount.
const { token } = store.getState().auth;
if (token) applySession(token);

setSessionExpiredHandler(() => store.dispatch(onLogout()));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReduxProvider>
  </StrictMode>,
);
