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

export function triggerFlyToCart(e?: React.MouseEvent | HTMLElement, imgUrl?: string) {
  if (typeof window === "undefined") return;

  // 1. Automatically smooth scroll to top so the cart icon and entire animation is clearly visible
  if (window.scrollY > 50) {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (_) {
      window.scrollTo(0, 0);
    }
  }

  let startX = window.innerWidth / 2;
  let startY = window.innerHeight / 2;

  if (e) {
    if ("clientX" in e && "clientY" in e) {
      startX = e.clientX;
      startY = e.clientY;
    } else if (e instanceof HTMLElement) {
      const rect = e.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }
  }

  // Find Cart Icon target position (Top header cart icon)
  let cartIconEl =
    document.querySelector("#header-cart-icon") ||
    document.querySelector("[data-cart-icon='true']") ||
    document.querySelector("[data-cart-icon]");

  let endX = window.innerWidth - 65;
  let endY = 40;

  if (cartIconEl) {
    const rect = cartIconEl.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      endX = rect.left + rect.width / 2;
      endY = rect.top + rect.height / 2;
    }
  }

  // Ensure reasonable bounds
  if (endY < 10) endY = 35;
  if (endX < 50) endX = window.innerWidth - 60;

  const detail: FlyingItem = {
    id: "fly_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36),
    startX: Math.max(20, Math.min(window.innerWidth - 60, startX)),
    startY: Math.max(50, Math.min(window.innerHeight - 50, startY)),
    endX,
    endY,
    imgUrl: imgUrl || "https://www.cera-india.com/sites/default/files/cera/product_images/S1013272.jpg",
  };

  window.dispatchEvent(new CustomEvent("fly-to-cart", { detail }));
}

export function FlyToCartContainer() {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [pulseTarget, setPulseTarget] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleFly = (event: Event) => {
      const customEvent = event as CustomEvent<FlyingItem>;
      if (!customEvent.detail) return;

      const newItem = customEvent.detail;
      setFlyingItems((prev) => [...prev, newItem]);

      // When item arrives at cart target (after 900ms)
      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((item) => item.id !== newItem.id));
        setPulseTarget({ x: newItem.endX, y: newItem.endY });
        window.dispatchEvent(new Event("cart-bounce"));
        setTimeout(() => setPulseTarget(null), 800);
      }, 920);
    };

    window.addEventListener("fly-to-cart", handleFly);
    return () => window.removeEventListener("fly-to-cart", handleFly);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999999] overflow-hidden">
      <AnimatePresence>
        {flyingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              x: item.startX - 36,
              y: item.startY - 36,
              scale: 0.7,
              rotate: -8,
              opacity: 0,
            }}
            animate={{
              x: [
                item.startX - 36,
                (item.startX + item.endX) / 2 - 20,
                item.endX - 16,
              ],
              y: [
                item.startY - 36,
                Math.min(item.startY, item.endY) - 70,
                item.endY - 16,
              ],
              scale: [0.7, 1.25, 0.9, 0.28],
              rotate: [-8, 12, -6, 0],
              opacity: [0, 1, 1, 0.4],
            }}
            exit={{ opacity: 0, scale: 0.1 }}
            transition={{
              duration: 0.92,
              times: [0, 0.35, 0.75, 1],
              ease: [0.16, 1, 0.3, 1], // Smooth parabolic flight curve
            }}
            className="absolute top-0 left-0 w-20 h-20 rounded-2xl bg-white border-2 border-[#c59b27] shadow-[0_12px_40px_rgba(197,155,39,0.85)] ring-4 ring-[#c59b27]/40 flex items-center justify-center p-2.5 backdrop-blur-xl z-[99999999]"
          >
            {item.imgUrl ? (
              <img
                src={item.imgUrl}
                alt="Product in flight"
                className="w-full h-full object-contain pointer-events-none rounded-xl"
              />
            ) : (
              <div className="w-full h-full bg-[#062524] rounded-xl flex items-center justify-center text-[#c59b27] text-2xl font-black shadow-inner">
                🛒
              </div>
            )}
            {/* Sparkle Badge */}
            <span className="absolute -top-2 -right-2 bg-[#c59b27] text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full shadow-md">
              +1
            </span>
          </motion.div>
        ))}

        {/* Golden Ripple Burst at Cart Icon upon Arrival */}
        {pulseTarget && (
          <motion.div
            key="cart-arrival-burst"
            initial={{
              x: pulseTarget.x - 24,
              y: pulseTarget.y - 24,
              scale: 0.5,
              opacity: 1,
            }}
            animate={{
              scale: [0.5, 2.2],
              opacity: [1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-[#c59b27] bg-[#c59b27]/30 shadow-[0_0_25px_rgba(197,155,39,0.9)] pointer-events-none z-[99999999]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

