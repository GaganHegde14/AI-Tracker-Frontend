import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { PremiumProvider } from "./context/PremiumContext.jsx";
import { FocusProvider } from "./context/FocusContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <TaskProvider>
      <NotificationProvider>
        <PremiumProvider>
          <FocusProvider>
            <App />
          </FocusProvider>
        </PremiumProvider>
      </NotificationProvider>
    </TaskProvider>
  </BrowserRouter>
);
