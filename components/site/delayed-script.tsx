"use client";
import { useEffect } from "react";

export function DelayedScript() {
  useEffect(() => {
    // Only load on client-side
    if (typeof window === "undefined") return;

    let loaded = false;

    const loadScript = () => {
      if (loaded) return;
      loaded = true;

      const script = document.createElement("script");
      script.src = "https://apps.abacus.ai/chatllm/appllm-lib.js";
      script.async = true;
      document.body.appendChild(script);

      // Clean up event listeners
      window.removeEventListener("scroll", loadScript);
      window.removeEventListener("touchstart", loadScript);
      window.removeEventListener("mousemove", loadScript);
    };

    // Load after a 8-second timeout as a fallback
    const timer = setTimeout(loadScript, 8000);

    // Or load instantly when the user interacts
    window.addEventListener("scroll", loadScript, { passive: true });
    window.addEventListener("touchstart", loadScript, { passive: true });
    window.addEventListener("mousemove", loadScript, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", loadScript);
      window.removeEventListener("touchstart", loadScript);
      window.removeEventListener("mousemove", loadScript);
    };
  }, []);

  return null;
}
