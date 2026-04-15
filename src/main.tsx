import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  return <h1>Chat App</h1>;
}

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);