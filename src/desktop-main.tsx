import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { GameShell } from "@/components/game/GameShell";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Desktop root element was not found");
}

function DesktopApp() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const teamPath = `${basePath}/equipe`;
  const isTeamPage = window.location.pathname.replace(/\/$/, "") === teamPath;

  return isTeamPage ? (
    <AdminPanel onBack={() => window.location.assign(`${basePath}/`)} />
  ) : (
    <GameShell showAdminLink={false} />
  );
}

createRoot(root).render(
  <StrictMode>
    <DesktopApp />
  </StrictMode>,
);