import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

console.log("Attempting to mount React application..."); // Added log

createRoot(document.getElementById("root")!).render(<App />);