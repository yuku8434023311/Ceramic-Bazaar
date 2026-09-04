"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  LogOut,
  Package,
  MapPin,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Tag,
  Truck,
  Headphones,
  Mail,
  Store,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getGuestCartCount } from "@/lib/cart-local";

type Category = { id: string; name: string; slug: string };

const CERAMIC_CATEGORIES: Category[] = [
  { id: "tiles", name: "Tiles", slug: "tiles" },
  { id: "sanitary-ware", name: "Sanitary Ware", slug: "sanitary-ware" },
  { id: "bathroom-fittings", name: "Bathroom Fittings", slug: "bathroom-fittings" },
  { id: "granite-marble", name: "Granite & Marble", slug: "granite-marble" },
  { id: "plumbing-hardware", name: "Plumbing & Hardware", slug: "plumbing-hardware" },
  { id: "paints", name: "Paints", slug: "paints" },
  { id: "tools", name: "Tools", slug: "tools" },
  { id: "kitchen-sinks", name: "Kitchen Sinks", slug: "kitchen-sinks" },
];

export function Header() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categories, setCategories] = useState<Category[]>(CERAMIC_CATEGORIES);
  const [cartCount, setCartCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);
  const [cartBouncing, setCartBouncing] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d) && d.length > 0) {
          setCategories(d);
        }
      })
      .catch(() => {});
  }, []);

  const updateCounts = () => {
    if (status === "authenticated") {
      Promise.all([
        fetch("/api/cart").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/wishlist").then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ]).then(([c, w]) => {
        setCartCount(Array.isArray(c) ? c.length : 0);
        setWishCount(Array.isArray(w) ? w.length : 0);
      });
    } else {
      setCartCount(getGuestCartCount());
      setWishCount(0);
    }
  };

  useEffect(() => {
    updateCounts();
    window.addEventListener("guest-cart-change", updateCounts);
    return () => {
      window.removeEventListener("guest-cart-change", updateCounts);
    };
  }, [status, pathname]);

  useEffect(() => {
    const handleCartBounce = () => {
      setCartBouncing(true);
      setTimeout(() => setCartBouncing(false), 500);
    };
    window.addEventListener("cart-bounce", handleCartBounce);
    return () => window.removeEventListener("cart-bounce", handleCartBounce);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (q) {
      const catParam =
        selectedCategory && selectedCategory !== "All Categories"
          ? `&category=${encodeURIComponent(
              categories.find((c) => c.name === selectedCategory)?.slug || ""
            )}`
          : "";
      router.push(`/products?search=${encodeURIComponent(q)}${catParam}`);
    }
  };

  const navMenuLinks = [
    { href: "/home", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/offers", label: "Offers" },
    { href: "/products?filter=new", label: "New Arrivals" },
    { href: "/products?filter=bestsellers", label: "Best Sellers" },
    { href: "/support#about", label: "About Us" },
    { href: "/support#contact", label: "Contact Us" },
  ];

  return (
    <header className="relative w-full max-w-full overflow-x-hidden z-40">
      {/* 1. TOP ANNOUNCEMENT BAR (Dark Teal) */}
      <div className="bg-[#031716] text-[#e2e8f0] py-2 px-3 sm:px-8 border-b border-[#062e2c] w-full max-w-full overflow-hidden">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between gap-2">
          {/* Left Badges */}
          <div className="flex items-center gap-3 sm:gap-8 min-w-0">
            <span className="flex items-center gap-1.5 sm:gap-2 font-bold text-[11px] sm:text-sm text-white tracking-wide truncate">
              <Sparkles className="w-3.5 h-3.5 text-[#c59b27] shrink-0" />
              <span className="truncate">Welcome to Ceramic Bazaar</span>
            </span>
            <span className="hidden md:flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#c59b27] bg-[#c59b27]/10 px-3 py-0.5 rounded-full border border-[#c59b27]/30 shrink-0">
              <Tag className="w-3.5 h-3.5 text-[#c59b27]" />
              All Items at Wholesale Rate
            </span>
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-3 sm:gap-6 text-[11px] sm:text-sm font-semibold text-slate-200 shrink-0">
            <Link
              href="/orders"
              className="hover:text-[#c59b27] flex items-center gap-1.5 transition-colors"
            >
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c59b27]" />
              <span className="hidden sm:inline">Track Order</span>
            </Link>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <Link
              href="/support"
              className="hover:text-[#c59b27] flex items-center gap-1.5 transition-colors"
            >
              <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c59b27]" />
              <span className="hidden sm:inline">Help & Support</span>
            </Link>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <Link
              href="/support#contact"
              className="hover:text-[#c59b27] flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c59b27]" />
              <span className="hidden sm:inline">Contact Us</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Clean White) */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-8 py-3 sm:py-3.5 w-full max-w-full overflow-x-hidden">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between gap-3 sm:gap-6">
          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6 text-slate-800" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] bg-white h-full overflow-y-auto p-6">
                <div className="flex flex-col gap-6 mt-2">
                  <Logo size="md" />
                  <div className="flex flex-col gap-1">
                    {navMenuLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="px-3 py-2.5 rounded-md hover:bg-slate-100 text-sm font-bold text-slate-800"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs uppercase font-extrabold text-[#c59b27] tracking-wider mb-2 px-3">
                      Categories
                    </p>
                    <div className="flex flex-col gap-1">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          href={`/products?category=${c.slug}`}
                          className="px-3 py-2 rounded-md hover:bg-slate-100 text-sm font-semibold text-slate-700"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Center Search Bar with Category Dropdown */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl mx-4 items-center border-2 border-slate-300 focus-within:border-[#062524] rounded-xl overflow-hidden transition-all shadow-sm"
          >
            <div className="relative flex-1">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for tiles, sanitary ware, bathroom fittings, marble..."
                className="w-full pl-4 pr-3 py-2.5 text-sm sm:text-base border-none shadow-none focus-visible:ring-0 placeholder:text-slate-400 font-medium h-11"
              />
            </div>

            {/* Category Dropdown inside Search */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="hidden lg:flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-800 bg-slate-100 border-l border-slate-300 hover:bg-slate-200 transition whitespace-nowrap h-11"
                >
                  <span className="truncate max-w-[140px]">{selectedCategory}</span>
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 max-h-80 overflow-y-auto bg-white shadow-2xl border-slate-200">
                <DropdownMenuItem onClick={() => setSelectedCategory("All Categories")} className="font-bold text-sm py-2">
                  All Categories
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => setSelectedCategory(c.name)}
                    className="font-medium text-sm py-2"
                  >
                    {c.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="bg-[#062524] hover:bg-[#0c3f3d] text-white px-6 h-11 flex items-center justify-center transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-[#c59b27]" />
            </button>
          </form>

          {/* Right Action Icons (Wishlist, Cart, Account) */}
          <div className="flex items-center gap-3 sm:gap-5 lg:gap-7">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="flex items-center gap-2 text-slate-800 hover:text-[#062524] transition group"
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-slate-700 group-hover:text-[#c59b27] transition" strokeWidth={1.6} />
                {wishCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-[#c59b27] text-slate-950 text-[10px] font-black flex items-center justify-center shadow-sm">
                    {wishCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-sm font-bold text-slate-800">Wishlist</span>
            </Link>

            {/* Cart with Gold Badge & Fly-To Target */}
            <Link
              href="/cart"
              id="header-cart-icon"
              data-cart-icon="true"
              className={`flex items-center gap-2 text-slate-800 hover:text-[#062524] transition group ${
                cartBouncing ? "scale-110" : ""
              }`}
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-slate-700 group-hover:text-[#062524] transition" strokeWidth={1.6} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-[#c59b27] text-slate-950 text-[10px] font-black flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-sm font-bold text-slate-800">Cart</span>
            </Link>

            {/* My Account / Login Dropdown */}
            {status === "authenticated" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-slate-800 hover:text-[#062524] transition">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#062524] transition">
                      <User className="w-4 h-4" strokeWidth={1.6} />
                    </div>
                    <div className="hidden xl:flex flex-col text-left leading-tight">
                      <span className="text-xs text-slate-500 font-medium">My Account</span>
                      <span className="text-sm font-bold text-slate-900 truncate max-w-[120px]">
                        {session?.user?.name || "Customer"}
                      </span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 bg-white shadow-2xl border-slate-200">
                  <div className="px-3 py-2.5">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{session?.user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {(session?.user as any)?.role === "ADMIN" && (
                    <DropdownMenuItem onClick={() => router.push("/admin")} className="font-bold text-emerald-700">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Super Admin Panel
                    </DropdownMenuItem>
                  )}
                  {(session?.user as any)?.role === "DEALER" && (
                    <DropdownMenuItem onClick={() => router.push("/dealer")} className="font-bold text-amber-700">
                      <Store className="mr-2 h-4 w-4" /> Dealer Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" /> My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/orders")}>
                    <Package className="mr-2 h-4 w-4" /> My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                    <Heart className="mr-2 h-4 w-4" /> My Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="text-red-600 font-semibold text-sm">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-slate-800 hover:text-[#062524] transition"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#062524] transition">
                    <User className="w-4 h-4" strokeWidth={1.6} />
                  </div>
                  <div className="hidden xl:flex flex-col text-left leading-tight">
                    <span className="text-xs text-slate-500 font-medium">My Account</span>
                    <span className="text-sm font-extrabold text-slate-900">Login / Register</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="md:hidden mt-3 flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tiles, sanitary, fittings..."
              className="pl-10 pr-3 py-2 text-sm bg-slate-100 border-slate-300 rounded-lg"
            />
          </div>
        </form>
      </div>

      {/* 3. NAVIGATION BAR (Desktop & Tablet: Deep Teal with Gold CTA Button) */}
      <nav className="hidden md:block bg-[#062524] text-white px-4 sm:px-8 border-t border-[#0d4a47]">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between h-13 py-1.5">
          {/* Nav Links */}
          <div className="flex items-center gap-6 lg:gap-8 overflow-x-auto scrollbar-none py-1">
            <Link
              href="/home"
              className={`text-sm sm:text-[15px] font-bold tracking-wide transition-colors whitespace-nowrap px-1 py-1 ${
                pathname === "/home" || pathname === "/"
                  ? "text-[#c59b27] border-b-2 border-[#c59b27]"
                  : "text-slate-100 hover:text-[#c59b27]"
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`text-sm sm:text-[15px] font-bold tracking-wide transition-colors whitespace-nowrap px-1 py-1 ${
                pathname === "/products"
                  ? "text-[#c59b27] border-b-2 border-[#c59b27]"
                  : "text-slate-100 hover:text-[#c59b27]"
              }`}
            >
              Shop
            </Link>

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm sm:text-[15px] font-bold tracking-wide text-slate-100 hover:text-[#c59b27] transition whitespace-nowrap focus:outline-none px-1 py-1"
                >
                  Categories <ChevronDown className="w-4 h-4 text-[#c59b27]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60 bg-white text-slate-800 shadow-2xl border-slate-200 p-2">
                {categories.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => router.push(`/products?category=${c.slug}`)}
                    className="cursor-pointer hover:bg-slate-100 font-semibold text-sm py-2.5 rounded-md"
                  >
                    {c.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/offers"
              className={`text-sm sm:text-[15px] font-bold tracking-wide transition-colors whitespace-nowrap px-1 py-1 ${
                pathname === "/offers"
                  ? "text-[#c59b27] border-b-2 border-[#c59b27]"
                  : "text-slate-100 hover:text-[#c59b27]"
              }`}
            >
              Offers
            </Link>
            <Link
              href="/products?filter=new"
              className="text-sm sm:text-[15px] font-bold tracking-wide text-slate-100 hover:text-[#c59b27] transition-colors whitespace-nowrap px-1 py-1"
            >
              New Arrivals
            </Link>
            <Link
              href="/products?filter=bestsellers"
              className="text-sm sm:text-[15px] font-bold tracking-wide text-slate-100 hover:text-[#c59b27] transition-colors whitespace-nowrap px-1 py-1"
            >
              Best Sellers
            </Link>
            <Link
              href="/support#about"
              className="text-sm sm:text-[15px] font-bold tracking-wide text-slate-100 hover:text-[#c59b27] transition-colors whitespace-nowrap px-1 py-1"
            >
              About Us
            </Link>
            <Link
              href="/support#contact"
              className="text-sm sm:text-[15px] font-bold tracking-wide text-slate-100 hover:text-[#c59b27] transition-colors whitespace-nowrap px-1 py-1"
            >
              Contact Us
            </Link>
          </div>

          {/* Far Right Gold CTA Button: Shop Now */}
          <div className="flex-shrink-0 pl-4">
            <Link href="/products">
              <button className="bg-[#c59b27] hover:bg-[#b38820] active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-2 rounded-md flex items-center gap-2 shadow-md transition-transform">
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

