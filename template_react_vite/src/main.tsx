import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { KeycloakProvider } from "./contexts/KeycloakProvider";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import { store } from "./stores/store";
import ToastContainerUi from './utils/ToastContainerUi.jsx'

createRoot(document.getElementById("root")!).render(
  <KeycloakProvider>
    <StrictMode>
      <ToastContainerUi />
      <Provider store={store}>
        <ToastContainerUi/>
        <App />
      </Provider>
    </StrictMode>
  </KeycloakProvider>
);