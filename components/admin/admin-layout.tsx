"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
  Ticket,
  Sun,
  Moon,
  User,
  FileText,
  Truck,
  Store,
  PackageCheck,
  Film,
  Activity,
  Bell,
  Headphones,
  Shield,
  ChevronDown,
  Phone,
  Bot,
} from "lucide-react";
import { CeramicLogoIcon } from "@/components/site/logo";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dealers", label: "Dealers Management", icon: Store },
  { href: "/admin/activities", label: "Activity Audit Logs", icon: Activity },
  { href: "/admin/dealer-products", label: "Dealer Products Approval", icon: PackageCheck },
  { href: "/admin/products", label: "My Admin Products", icon: Package },
  { href: "/admin/banners", label: "Hero Banners & Videos", icon: Film },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/invoices", label: "Billing & Custom Invoices", icon: FileText },
  { href: "/delivery-partner", label: "Delivery Partner App", icon: Truck },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Offers & Coupons", icon: Ticket },
  { href: "/profile", label: "My Profile", icon: User },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession() || {};
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      const savedTheme = localStorage.getItem("admin-theme");
      if (savedTheme === "light") {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
      } else {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("admin-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("admin-theme", "light");
      }
      return next;
    });
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="w-full min-h-screen bg-[#021211] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* ===== STICKY TOP SUPER ADMIN HEADER ===== */}
      <header className="sticky top-0 z-50 w-full bg-[#031716] border-b border-[#0d4a47] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xl">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg bg-[#062524] border border-[#0d4a47] text-white hover:text-[#c59b27] transition"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo & Super Admin Text */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#062524] border border-[#c59b27]/40 flex items-center justify-center shadow-md">
              <CeramicLogoIcon className="w-6 h-6" isWhite={false} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-black text-lg tracking-wider text-white">
                CERAMIC <span className="text-[#c59b27]">BAZAAR</span>
              </span>
              <span className="text-[10px] font-bold text-[#c59b27] tracking-widest uppercase pt-0.5">
                Super Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Mode Toggle + Notification Bell + Admin Profile + Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="hidden sm:flex items-center gap-2 bg-[#062524] hover:bg-[#0a3533] border border-[#0d4a47] rounded-xl px-3.5 py-1.5 text-xs font-bold text-slate-200 transition shadow-sm"
            title="Toggle Theme"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-300" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {/* Notification Bell with Badge */}
          <button
            className="relative p-2 rounded-xl bg-[#062524] hover:bg-[#0a3533] border border-[#0d4a47] text-slate-200 hover:text-[#c59b27] transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#c59b27] ring-2 ring-[#031716]" />
          </button>

          {/* Super Admin User Profile Pill */}
          <div className="flex items-center gap-2.5 bg-[#062524] border border-[#0d4a47] rounded-xl px-3 py-1.5 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-[#c59b27]/20 border border-[#c59b27]/50 flex items-center justify-center text-[#c59b27]">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-xs font-extrabold text-white truncate max-w-[120px]">
                {session?.user?.name || "Admin User"}
              </span>
              <span className="text-[10px] font-bold text-[#c59b27]">Super Admin</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ===== BODY: SIDEBAR + MAIN VIEW ===== */}
      <div className="flex flex-1 relative w-full max-w-full overflow-x-hidden">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        {/* ===== LUXURY SIDEBAR ===== */}
        <aside
          className={`fixed top-[61px] left-0 h-[calc(100vh-61px)] w-64 bg-[#031716] border-r border-[#0d4a47] flex flex-col justify-between p-4 z-40 transition-transform duration-300 ease-in-out lg:static lg:h-auto lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } overflow-y-auto scrollbar-thin scrollbar-thumb-[#0d4a47]`}
        >
          <div>
            {/* Section Header */}
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#c59b27] px-3 mb-3">
              ADMIN CONTROLS
            </p>

            {/* Navigation Menu */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-[#083230] text-white border border-[#c59b27] shadow-lg shadow-[#c59b27]/10"
                        : "text-slate-300 hover:text-white hover:bg-[#062524] border border-transparent"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? "text-[#c59b27]" : "text-slate-400 group-hover:text-[#c59b27]"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Card: Need Support? */}
          <div className="mt-6 pt-4 border-t border-[#0d4a47]/70">
            <div className="bg-[#062524] rounded-2xl p-4 border border-[#0d4a47] text-center space-y-2.5 shadow-md">
              <div className="w-8 h-8 rounded-full bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center text-[#c59b27] mx-auto">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-white">Need Support?</p>
                <p className="text-[10px] text-slate-300">We are here to help you!</p>
              </div>
              <a
                href="https://wa.me/918796020860"
                target="_blank"
                rel="noreferrer"
                className="block w-full"
              >
                <button className="w-full bg-[#c59b27] hover:bg-[#b38820] active:scale-95 text-slate-950 font-black text-xs py-2 rounded-xl shadow transition-transform">
                  Contact Support
                </button>
              </a>
            </div>
          </div>
        </aside>

        {/* ===== MAIN DASHBOARD VIEW ===== */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 bg-[#021211] w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

