"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FlyingItem {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  imgUrl?: string;
}

export function triggerFlyToCart(e: React.MouseEvent | HTMLElement, imgUrl?: string) {
  if (typeof window === "undefined") return;

  let startX = window.innerWidth / 2;
  let startY = window.innerHeight / 2;

  if ("clientX" in e && "clientY" in e) {
    startX = e.clientX;
    startY = e.clientY;
  } else if (e instanceof HTMLElement) {
    const rect = e.getBoundingClientRect();
    startX = rect.left + rect.width / 2;
    startY = rect.top + rect.height / 2;
  }

  // Find Cart Icon target position (Top header cart or bottom nav cart)
  let cartIconEl = document.querySelector("#header-cart-icon") || document.querySelector("[data-cart-icon]");
  
  // On mobile screens, check if bottom cart tab is present and visible
  const bottomCartEl = document.querySelector("#bottom-cart-tab");
  if (window.innerWidth < 768 && bottomCartEl) {
    const bRect = bottomCartEl.getBoundingClientRect();
    if (bRect.top > 0) {
      cartIconEl = bottomCartEl;
    }
  }

  let endX = window.innerWidth - 50;
  let endY = 35;

  if (cartIconEl) {
    const rect = cartIconEl.getBoundingClientRect();
    endX = rect.left + rect.width / 2;
    endY = rect.top + rect.height / 2;
  }

  const detail: FlyingItem = {
    id: "fly_" + Math.random().toString(36).substring(2, 9),
    startX,
    startY,
    endX,
    endY,
    imgUrl,
  };

  window.dispatchEvent(new CustomEvent("fly-to-cart", { detail }));
}

export function FlyToCartContainer() {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  useEffect(() => {
    const handleFly = (event: Event) => {
      const customEvent = event as CustomEvent<FlyingItem>;
      if (!customEvent.detail) return;

      const newItem = customEvent.detail;
      setFlyingItems((prev) => [...prev, newItem]);

      // Remove after animation completes (900ms smooth luxury arc)
      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((item) => item.id !== newItem.id));
        // Trigger cart icon bounce when thumbnail arrives
        window.dispatchEvent(new Event("cart-bounce"));
      }, 950);
    };

    window.addEventListener("fly-to-cart", handleFly);
    return () => window.removeEventListener("fly-to-cart", handleFly);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999999] overflow-hidden">
      <AnimatePresence>
        {flyingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              x: item.startX - 30,
              y: item.startY - 30,
              scale: 1.1,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              x: [item.startX - 30, (item.startX + item.endX) / 2 - 20, item.endX - 15],
              y: [
                item.startY - 30,
                Math.min(item.startY, item.endY) - 50,
                item.endY - 15,
              ],
              scale: [1.1, 0.85, 0.35],
              rotate: [0, -12, 8, 0],
              opacity: [1, 1, 0.2],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.95,
              ease: [0.22, 1, 0.36, 1], // Smooth cubic-bezier parabolic motion
            }}
            className="absolute top-0 left-0 w-16 h-16 rounded-2xl bg-white border-2 border-[#c59b27] shadow-[0_10px_30px_rgba(197,155,39,0.7)] ring-4 ring-[#c59b27]/30 overflow-hidden flex items-center justify-center p-2 backdrop-blur-md z-[9999999]"
          >
            {item.imgUrl ? (
              <img
                src={item.imgUrl}
                alt="Added product"
                className="w-full h-full object-contain pointer-events-none rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-[#062524] rounded-lg flex items-center justify-center text-[#c59b27] text-lg font-black shadow-inner">
                🛒
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
