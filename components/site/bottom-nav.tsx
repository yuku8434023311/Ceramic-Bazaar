"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, ShoppingCart, User, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";

const items = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/products", icon: LayoutGrid, label: "Shop" },
  { href: "/wishlist", icon: Heart, label: "Wishlist" },
  { href: "/cart", icon: ShoppingCart, label: "Cart" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  // Listen to theme changes in real time
  useEffect(() => {
    const checkDark = () => {
      const dark = document.documentElement.classList.contains("dark") || localStorage.getItem("site-theme") === "dark";
      setIsDark(dark);
    };

    // Check on mount
    checkDark();

    // Watch for class changes on <html>
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const raw = localStorage.getItem("ceramic_bazaar_guest_cart") || localStorage.getItem("guest_cart");
        if (raw) {
          const items = JSON.parse(raw);
          setCartCount(Array.isArray(items) ? items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) : 0);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };
    updateCount();
    window.addEventListener("guest-cart-change", updateCount);
    return () => window.removeEventListener("guest-cart-change", updateCount);
  }, [pathname]);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 backdrop-blur-xl border-t transition-colors duration-300"
      style={{
        background: isDark ? "rgba(15,23,42,0.97)" : "rgba(255,255,255,0.97)",
        borderColor: isDark ? "#334155" : "#e2e8f0",
      }}
    >
      <div className="grid grid-cols-5 max-w-[1200px] mx-auto">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/home" && pathname?.startsWith(href));
          const isCart = href === "/cart";
          return (
            <Link
              key={href}
              href={href}
              id={isCart ? "bottom-cart-tab" : undefined}
              data-cart-icon={isCart ? "true" : undefined}
              className="relative flex flex-col items-center justify-center py-2 gap-0.5 transition no-tap-highlight"
              style={{
                color: active
                  ? "#c59b27"
                  : isDark
                  ? "#94a3b8"
                  : "#64748b",
              }}
            >
              <div className="relative">
                <Icon className="w-5 h-5 shrink-0" strokeWidth={1.75} />
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 h-3.5 min-w-[15px] px-0.5 rounded-full bg-[#c59b27] text-slate-950 text-[9px] font-black flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
