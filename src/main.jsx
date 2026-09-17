import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AdminPanel from "./AdminPanel.jsx";

function Root() {
  // Navigate to /admin in the URL to open admin panel
  const [isAdmin, setIsAdmin] = useState(
    window.location.hash === "#admin"
  );

  function openAdmin() {
    window.location.hash = "admin";
    setIsAdmin(true);
  }

  function exitAdmin() {
    window.location.hash = "";
    setIsAdmin(false);
  }

  if (isAdmin) {
    return <AdminPanel onExit={exitAdmin} />;
  }

  return <App onAdminAccess={openAdmin} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
