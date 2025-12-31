"use client";

import { useEffect } from "react";

export function SecretNeonMode() {
  useEffect(() => {
    let typed: string[] = [];
    const secretCode = "neon";

    const handleKeyPress = (e: KeyboardEvent) => {
      typed.push(e.key.toLowerCase());
      typed = typed.slice(-4); // Keep only last 4 characters

      if (typed.join("") === secretCode) {
        toggleNeonMode();
      }
    };

    const toggleNeonMode = () => {
      const isActive = document.documentElement.classList.contains("neon-mode");

      if (!isActive) {
        // Activate NEON PINK mode
        document.documentElement.classList.add("neon-mode");

        // Override CSS variables with INTENSE neon pink
        const style = document.createElement("style");
        style.id = "neon-override";
        style.textContent = `
          .neon-mode {
            --background: 320 100% 5% !important;
            --foreground: 320 100% 98% !important;
            --card: 320 90% 10% !important;
            --card-foreground: 320 100% 95% !important;
            --primary: 320 100% 60% !important;
            --primary-foreground: 0 0% 100% !important;
            --secondary: 280 100% 60% !important;
            --accent: 340 100% 65% !important;
            --border: 320 100% 50% !important;
            --input: 320 80% 20% !important;
            --ring: 320 100% 60% !important;
            
            filter: saturate(2) contrast(1.4) brightness(1.1) !important;
          }
          
          .neon-mode * {
            text-shadow: 0 0 8px rgba(255, 0, 255, 0.8), 0 0 15px rgba(255, 0, 255, 0.5) !important;
          }
          
          .neon-mode button,
          .neon-mode .border,
          .neon-mode [class*="border"] {
            box-shadow: 0 0 15px rgba(255, 0, 255, 0.6), inset 0 0 10px rgba(255, 0, 255, 0.3) !important;
            border-color: rgb(255, 0, 255) !important;
          }
          
          .neon-mode input,
          .neon-mode select,
          .neon-mode textarea {
            box-shadow: 0 0 10px rgba(255, 0, 255, 0.5) !important;
            border-color: rgb(255, 0, 255) !important;
          }
          
          @keyframes neon-pulse {
            0%, 100% { 
              filter: saturate(2) contrast(1.4) brightness(1.1);
            }
            50% { 
              filter: saturate(2.5) contrast(1.5) brightness(1.2);
            }
          }
          
          .neon-mode {
            animation: neon-pulse 3s infinite !important;
          }
        `;
        document.head.appendChild(style);

        console.log(
          "%c✨ NEON PINK MODE ACTIVATED! ✨",
          "font-size: 24px; font-weight: bold; color: #ff00ff; text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff; background: #000; padding: 10px;"
        );
        console.log('%cType "neon" again to disable', "color: #ff00ff;");
      } else {
        // Deactivate
        document.documentElement.classList.remove("neon-mode");
        document.getElementById("neon-override")?.remove();
        console.log("%c👋 Neon mode disabled", "color: #888;");
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, []);

  return null;
}
