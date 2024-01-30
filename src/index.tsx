import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { StrictMode } from "react";
import "./index.css";

createRoot(document.getElementById("main") as HTMLDivElement).render(
    <StrictMode>
        <App />
    </StrictMode>
);
