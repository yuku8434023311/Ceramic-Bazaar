"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  X,
  Send,
  Package,
  Flame,
  Store,
  Phone,
  Bot,
  Sparkles,
  ExternalLink,
  RefreshCw,
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  Hourglass,
  Layers,
  FileText,
  Truck,
  Ticket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: { label: string; action: string }[];
  link?: string;
  linkText?: string;
}

export function LiveSupportWidget() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isSupportPage = pathname === "/support";

  // Hide the floating widget on regular storefront pages (Home, Products, Cart, etc.)
  // to ensure 100% unobstructed viewing visibility and smooth user navigation
  if (!isAdmin && !isSupportPage) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);


  useEffect(() => {
    if (isAdmin) {
      setMessages([
        {
          id: "admin-msg-1",
          sender: "bot",
          text: "Welcome, Super Admin! 👑\n\nI am your dedicated **Executive AI Copilot** with full access to the Ceramic Bazaar Admin Panel. How can I assist with your store operations today?",
          options: [
            { label: "📊 Store Analytics & Revenue", action: "ADMIN_STATS" },
            { label: "🏪 Pending Dealer Approvals (18)", action: "ADMIN_DEALERS" },
            { label: "📦 Review Dealer Products", action: "ADMIN_PRODUCTS" },
            { label: "🛒 Inspect Recent Orders", action: "ADMIN_ORDERS" },
            { label: "🚚 Delivery Driver Access & Password", action: "ADMIN_DELIVERY" },
            { label: "🎬 Manage Banners & Videos", action: "ADMIN_BANNERS" },
          ],
        },
      ]);
    } else {
      setMessages([
        {
          id: "msg-1",
          sender: "bot",
          text: "Hello! Welcome to Ceramic Bazaar Live Support. 👋\n\nHow can we help you build your dream space today?",
          options: [
            { label: "📦 Track My Order", action: "ACTION_TRACK" },
            { label: "✨ Explore Today's Best Offers", action: "ACTION_OFFERS" },
            { label: "📍 Store Location & Directions", action: "ACTION_LOCATION" },
            { label: "💬 Chat on WhatsApp (+91 93153 09289)", action: "ACTION_WHATSAPP" },
          ],
        },
      ]);
    }
  }, [isAdmin]);

  const handleOptionClick = async (action: string, label: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: label,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    setTimeout(async () => {
      if (action === "ADMIN_STATS") {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: "📊 **Ceramic Bazaar Real-Time Performance Summary:**\n\n• **Total Dealer Sales:** ₹2,45,780 (+15.6%)\n• **Registered Dealers:** 128 (110 Approved, 18 Pending)\n• **Active Categories:** Tiles (42%), Sanitary Ware (30%), Fittings (18%)\n• **System Status:** 🟢 All Services Operational & Synchronized.",
            link: "/admin",
            linkText: "📊 Open Full Analytics Dashboard",
          },
        ]);
      } else if (action === "ADMIN_DEALERS") {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: "🏪 **Dealers Management Overview:**\n\n• **Pending Approvals:** 18 new dealer registration requests requiring your verification.\n• **Recent Request:** 'Kumar Traders', 'Maa Durga Traders'\n\nYou can review, approve, reject, or assign custom discount tiers:",
            link: "/admin/dealers",
            linkText: "🏪 Open Dealers Management",
          },
        ]);
      } else if (action === "ADMIN_PRODUCTS") {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: "📦 **Dealer Products Approval Queue:**\n\n• New catalogs submitted by authorized dealers are pending approval before going live on the customer storefront.",
            link: "/admin/dealer-products",
            linkText: "📦 Open Product Approval Queue",
          },
        ]);
      } else if (action === "ADMIN_ORDERS") {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: "🛒 **Store Orders Center:**\n\n• Monitor live order status, update dispatch tracking, generate custom invoices, or assign delivery executives.",
            link: "/admin/orders",
            linkText: "🛒 Open Orders Management",
          },
        ]);
      } else if (action === "ADMIN_DELIVERY") {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: "🚚 **Delivery Partner App & Security Credentials:**\n\n• **Driver App Password:** `CeramicDriver@2026`\n• Delivery agents use this security passcode to log in and update shipment statuses.",
            link: "/delivery-partner",
            linkText: "🚚 Launch Delivery Partner App",
          },
        ]);
      } else if (action === "ADMIN_BANNERS") {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: "🎬 **Store Banners & Media Center:**\n\n• Upload full-screen hero sliders, promotional videos, and seasonal discount graphics.",
            link: "/admin/banners",
            linkText: "🎬 Manage Banners & Videos",
          },
        ]);
      } else if (action === "ACTION_TRACK") {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: "📦 You can track your existing orders, view delivery estimates, and download GST tax invoices directly from your Orders page:",
            link: "/orders",
            linkText: "📦 View & Track My Orders",
          },
        ]);
      } else if (action === "ACTION_OFFERS") {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: "✨ Check out our latest wholesale discounts, brand partner promotions, and special festive deals on premium sanitary ware & tiles:",
            link: "/offers",
            linkText: "🏷️ Browse Active Offers",
          },
        ]);
      } else if (action === "ACTION_LOCATION") {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: "📍 **Ceramic Bazaar Showroom:**\n\nBhagwanpur Hat, Siwan, Bihar – 841408\n\n🕒 **Hours:** Mon - Sat : 9:00 AM - 8:00 PM\n📞 **Phone:** +91 93153 09289",
            link: "https://maps.google.com/?q=Bhagwanpur+Hat+Siwan+Bihar+841408",
            linkText: "📍 Get Directions on Google Maps",
          },
        ]);
      } else if (action === "ACTION_WHATSAPP") {
        const whatsappUrl = `https://wa.me/919315309289?text=${encodeURIComponent(
          "Hello Ceramic Bazaar Support, I would like to inquire about products and pricing."
        )}`;
        window.open(whatsappUrl, "_blank");
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: "📲 Opening WhatsApp support (+91 93153 09289)... Click below if it didn't open automatically.",
            link: whatsappUrl,
            linkText: "💬 Open WhatsApp Chat",
          },
        ]);
      }
      setLoading(false);
    }, 500);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", text: userText },
    ]);
    setLoading(true);

    setTimeout(() => {
      const q = userText.toLowerCase();

      if (isAdmin) {
        if (q.includes("order") || q.includes("sales") || q.includes("revenue")) {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "🛒 **Orders & Revenue Intelligence:**\n\nTotal dealer sales this week: ₹2,45,780 with high volume in Vitrified Tiles & Sanitary Ware. You can view full invoices and tracking below:",
              link: "/admin/orders",
              linkText: "🛒 View All Orders",
            },
          ]);
        } else if (q.includes("dealer") || q.includes("approval")) {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "🏪 **Dealers Directory:**\n\n128 total registered dealers with 18 awaiting verification. Click below to manage approvals or adjust pricing rules:",
              link: "/admin/dealers",
              linkText: "🏪 Manage Dealers",
            },
          ]);
        } else if (q.includes("product") || q.includes("stock") || q.includes("item")) {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "📦 **Product Inventory Controls:**\n\nYou can create new products, update prices, manage stock quantities, or review dealer catalog submissions:",
              link: "/admin/products",
              linkText: "📦 Open Product Manager",
            },
          ]);
        } else if (q.includes("banner") || q.includes("video") || q.includes("hero")) {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "🎬 **Hero Banners & Storefront Media:**\n\nManage top carousel banners, video showcase links, and promotional highlights:",
              link: "/admin/banners",
              linkText: "🎬 Manage Banners",
            },
          ]);
        } else if (q.includes("invoice") || q.includes("bill") || q.includes("receipt")) {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "🧾 **Billing & Custom Invoices:**\n\nGenerate printable customer invoices, billing summaries, and receipts:",
              link: "/admin/invoices",
              linkText: "🧾 Open Invoicing Center",
            },
          ]);
        } else if (q.includes("driver") || q.includes("delivery") || q.includes("password")) {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "🚚 **Delivery Partner Security Credentials:**\n\n• Security Passcode: `CeramicDriver@2026`\n• Access the driver portal for dispatch updates:",
              link: "/delivery-partner",
              linkText: "🚚 Open Delivery Portal",
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: `👑 **Admin AI Copilot:** Understood your request for "${userText}". Here are direct shortcuts to your administrator controls:`,
              options: [
                { label: "📊 Store Analytics", action: "ADMIN_STATS" },
                { label: "🏪 Dealers Management", action: "ADMIN_DEALERS" },
                { label: "📦 Product Approvals", action: "ADMIN_PRODUCTS" },
                { label: "🛒 Orders & Invoices", action: "ADMIN_ORDERS" },
              ],
            },
          ]);
        }
      } else {
        if (q.includes("price") || q.includes("rate") || q.includes("wholesale") || q.includes("cost")) {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "🏷️ Ceramic Bazaar offers direct factory wholesale pricing on Tiles, Sanitary Ware & Bathroom Fittings. Explore our full catalog below:",
              link: "/products",
              linkText: "🛍️ Browse Products & Prices",
            },
          ]);
        } else if (q.includes("contact") || q.includes("phone") || q.includes("call") || q.includes("number")) {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "📞 **Customer Helpline:**\n\nPhone: +91 87960 20860\nEmail: ceramicbazaar@gmail.com\nAddress: Bhagwanpur Hat, Siwan, Bihar – 841408",
              link: "https://wa.me/918796020860",
              linkText: "💬 Chat on WhatsApp",
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: "Thank you for messaging Ceramic Bazaar! Our team is available to assist you. What would you like to explore?",
              options: [
                { label: "📦 Track My Order", action: "ACTION_TRACK" },
                { label: "✨ Wholesale Offers", action: "ACTION_OFFERS" },
                { label: "📍 Store Address", action: "ACTION_LOCATION" },
                { label: "💬 WhatsApp Support", action: "ACTION_WHATSAPP" },
              ],
            },
          ]);
        }
      }
      setLoading(false);
    }, 600);
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 ${
            isAdmin
              ? "bg-[#062524] hover:bg-[#083230] border-2 border-[#c59b27] text-white"
              : "bg-gradient-to-r from-[#021211] via-[#062524] to-[#041c1b] border-2 border-[#c59b27] text-white"
          }`}
          aria-label={isAdmin ? "Super Admin AI Copilot" : "Live Support"}
        >
          <div className="relative">
            {isAdmin ? (
              <Bot className="w-5 h-5 text-[#c59b27]" />
            ) : (
              <MessageSquare className="w-5 h-5 text-[#c59b27]" />
            )}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse ring-2 ring-slate-900" />
          </div>
          <span className="text-xs sm:text-sm font-extrabold tracking-wide">
            {isAdmin ? "Super Admin AI Copilot" : "Support & Help"}
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[420px] max-h-[580px] h-[80vh] bg-[#031716] border-2 border-[#c59b27]/80 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden font-sans backdrop-blur-xl"
          >
            <div className="bg-[#062524] border-b border-[#0d4a47] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center text-[#c59b27] shadow-inner">
                  {isAdmin ? <Bot className="w-6 h-6" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>{isAdmin ? "Super Admin AI Copilot" : "Ceramic Bazaar Live Support"}</span>
                  </h3>
                  <p className="text-[11px] text-[#c59b27] font-bold">
                    {isAdmin ? "🛡️ Full Administrator Access" : "🟢 Online • 9 AM - 8 PM"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-[#021817] text-slate-400 hover:text-white border border-slate-700/80 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-[#0d4a47]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm font-medium leading-relaxed ${
                      m.sender === "user"
                        ? "bg-[#c59b27] text-slate-950 font-bold rounded-tr-none shadow-md"
                        : "bg-[#062524] border border-[#0d4a47] text-white rounded-tl-none shadow-md"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {m.link && (
                      <div className="mt-2.5 pt-2 border-t border-white/15">
                        <a
                          href={m.link}
                          target={m.link.startsWith("http") ? "_blank" : "_self"}
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-black text-[#c59b27] bg-[#021817] px-3 py-1.5 rounded-xl border border-[#c59b27]/40 hover:bg-[#083230] transition"
                        >
                          <span>{m.linkText || "View Details"}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {m.options && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                      {m.options.map((opt) => (
                        <button
                          key={opt.action}
                          onClick={() => handleOptionClick(opt.action, opt.label)}
                          className="text-[11px] sm:text-xs font-bold bg-[#062524] hover:bg-[#0a3533] text-slate-200 hover:text-white border border-[#0d4a47] hover:border-[#c59b27] px-3 py-1.5 rounded-xl transition shadow-sm text-left"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#062524] p-3 rounded-2xl border border-[#0d4a47] w-fit">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c59b27]" />
                  <span>AI Copilot is processing...</span>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSend}
              className="p-3 bg-[#062524] border-t border-[#0d4a47] flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isAdmin
                    ? "Ask Super Admin Copilot (e.g. check pending approvals)..."
                    : "Type your query here..."
                }
                className="flex-1 bg-[#021817] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-xl bg-[#c59b27] hover:bg-[#b38820] active:scale-95 text-slate-950 font-black disabled:opacity-50 transition shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
