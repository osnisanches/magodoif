import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { GameShell } from "@/components/game/GameShell";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Desktop root element was not found");
}

function DesktopApp() {
  const [showAdmin, setShowAdmin] = useState(false);

  return showAdmin ? (
    <AdminPanel onBack={() => setShowAdmin(false)} />
  ) : (
    <GameShell onOpenAdmin={() => setShowAdmin(true)} />
  );
}

createRoot(root).render(
  <StrictMode>
    <DesktopApp />
  </StrictMode>,
);