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

  // 1. Locate the exact Cart icon element in the DOM
  const cartIconEl =
    document.querySelector("#header-cart-icon-inner") ||
    document.querySelector("#header-cart-icon") ||
    document.querySelector("[data-cart-icon='true']") ||
    document.querySelector("[data-cart-icon]");

  // Default fallback if element is somehow unmounted
  let endX = window.innerWidth - 65;
  let endY = 65;

  if (cartIconEl) {
    const rect = cartIconEl.getBoundingClientRect();
    // Document-absolute coordinates:
    // When the page scrolls to top (scrollY = 0), the element sits at viewport Y = docTop
    const docTop = rect.top + window.scrollY;
    const docLeft = rect.left + window.scrollX;

    endX = docLeft + rect.width / 2;
    endY = docTop + rect.height / 2;
  }

  // Safety clamps
  if (endY < 15 || isNaN(endY)) endY = 65;
  if (endX < 30 || isNaN(endX)) endX = window.innerWidth - 65;

  // 2. Smoothly scroll to top so the cart icon and entire animation is clearly visible
  if (window.scrollY > 20) {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (_) {
      window.scrollTo(0, 0);
    }
  }

  // 3. Calculate start position from user's click coordinate or clicked button center
  let startX = window.innerWidth / 2;
  let startY = window.innerHeight / 2;

  if (e) {
    if ("clientX" in e && "clientY" in e && typeof e.clientX === "number" && typeof e.clientY === "number" && (e.clientX > 0 || e.clientY > 0)) {
      startX = e.clientX;
      startY = e.clientY;
    } else if (e instanceof HTMLElement) {
      const rect = e.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }
  }

  const detail: FlyingItem = {
    id: "fly_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36),
    startX: Math.max(30, Math.min(window.innerWidth - 30, startX)),
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

      // When item arrives precisely at the cart target (after 920ms)
      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((item) => item.id !== newItem.id));
        setPulseTarget({ x: newItem.endX, y: newItem.endY });
        window.dispatchEvent(new Event("cart-bounce"));
        setTimeout(() => setPulseTarget(null), 750);
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
              scale: 0.65,
              rotate: -6,
              opacity: 0,
            }}
            animate={{
              x: [
                item.startX - 36,
                (item.startX + item.endX) / 2 - 36,
                item.endX - 36,
              ],
              y: [
                item.startY - 36,
                Math.min(item.startY, item.endY) - 55,
                item.endY - 36,
              ],
              scale: [0.65, 1.2, 0.8, 0.12],
              rotate: [-6, 10, -4, 0],
              opacity: [0, 1, 1, 0.2],
            }}
            exit={{ opacity: 0, scale: 0.05 }}
            transition={{
              duration: 0.92,
              times: [0, 0.35, 0.75, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              transformOrigin: "center center",
            }}
            className="absolute top-0 left-0 w-[72px] h-[72px] rounded-2xl bg-white border-2 border-[#c59b27] shadow-[0_12px_40px_rgba(197,155,39,0.85)] ring-4 ring-[#c59b27]/40 flex items-center justify-center p-2 backdrop-blur-xl z-[99999999]"
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

        {/* Golden Ripple Burst pinpointed exactly at Cart Icon upon Arrival */}
        {pulseTarget && (
          <motion.div
            key="cart-arrival-burst"
            initial={{
              x: pulseTarget.x - 22,
              y: pulseTarget.y - 22,
              scale: 0.5,
              opacity: 1,
            }}
            animate={{
              scale: [0.5, 2.3],
              opacity: [1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            style={{
              transformOrigin: "center center",
            }}
            className="absolute top-0 left-0 w-11 h-11 rounded-full border-2 border-[#c59b27] bg-[#c59b27]/30 shadow-[0_0_25px_rgba(197,155,39,0.9)] pointer-events-none z-[99999999]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

