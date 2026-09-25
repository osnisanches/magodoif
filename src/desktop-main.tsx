import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GameShell } from "@/components/game/GameShell";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Desktop root element was not found");
}

createRoot(root).render(
  <StrictMode>
    <GameShell />
  </StrictMode>,
);