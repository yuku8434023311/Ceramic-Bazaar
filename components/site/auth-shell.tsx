"use client";
import React, { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Tag, Truck, Lock, MapPin, Phone } from "lucide-react";
import { Logo, CeramicLogoIcon } from "./logo";

export function AuthShell({
  title,
  subtitle,
  children,
  isWide = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  isWide?: boolean;
}) {
  return (
    <div className="relative min-h-screen w-full bg-[#021211] text-white flex flex-col lg:flex-row items-stretch justify-between overflow-x-hidden select-none">
      {/* LEFT SECTION: BRAND SHOWCASE & ATMOSPHERIC DISPLAY (Desktop 55% - 60% Width) */}
      <div className="relative flex-1 hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden">
        {/* Background Visual: Luxury Dark Bathroom with Mirror Glow & Marble */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85 pointer-events-none transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `linear-gradient(to right, #021211 20%, rgba(2, 18, 17, 0.75) 60%, rgba(2, 18, 17, 0.4) 100%), linear-gradient(to top, #021211 15%, transparent 60%), url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&auto=format&fit=crop&q=80')`,
          }}
        />

        {/* Ambient Gold Glow Halo */}
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-[#c59b27]/15 blur-[120px] pointer-events-none" />

        {/* TOP BRAND HEADER */}
        <div className="relative z-10 space-y-1">
          <Logo size="lg" white />
          <p className="text-xs text-slate-300 font-semibold tracking-wide pl-0.5 pt-1">
            Everything You Need, All in One Place
          </p>
        </div>

        {/* MIDDLE HERO SLOGAN */}
        <div className="relative z-10 max-w-xl space-y-3.5 my-auto py-10">
          <h2 className="text-4xl xl:text-5xl font-black uppercase tracking-tight text-white leading-[1.15]">
            BUILD YOUR <br />
            <span className="text-[#c59b27] font-serif tracking-normal drop-shadow-md">
              DREAM SPACE
            </span>
          </h2>
          <p className="text-base xl:text-lg text-slate-200 font-bold">
            Premium Tiles, Sanitary Ware, Bathroom Fittings & More
          </p>
          <p className="text-sm text-[#c59b27] font-semibold">
            Everything You Need, All in One Place
          </p>
        </div>

        {/* BOTTOM SECTION: 4 TRUST PILLARS + STORE CONTACT */}
        <div className="relative z-10 space-y-4 max-w-2xl">
          {/* 4 Trust Pillars Bar */}
          <div className="bg-[#062524]/85 backdrop-blur-md rounded-2xl p-4 xl:p-5 border border-[#0d4a47]/90 shadow-2xl grid grid-cols-4 gap-3 text-center divide-x divide-[#0d4a47]/80">
            {/* 1. Genuine */}
            <div className="flex flex-col items-center justify-center space-y-1 px-1">
              <div className="w-9 h-9 rounded-lg bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center text-[#c59b27] mb-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="font-extrabold text-xs text-white leading-tight">100% Genuine Products</p>
              <p className="text-[10px] text-slate-300 font-medium">Quality Assured</p>
            </div>

            {/* 2. Wholesale */}
            <div className="flex flex-col items-center justify-center space-y-1 px-1">
              <div className="w-9 h-9 rounded-lg bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center text-[#c59b27] mb-0.5">
                <Tag className="w-5 h-5" />
              </div>
              <p className="font-extrabold text-xs text-white leading-tight">Wholesale Pricing</p>
              <p className="text-[10px] text-slate-300 font-medium">Best Prices</p>
            </div>

            {/* 3. Delivery */}
            <div className="flex flex-col items-center justify-center space-y-1 px-1">
              <div className="w-9 h-9 rounded-lg bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center text-[#c59b27] mb-0.5">
                <Truck className="w-5 h-5" />
              </div>
              <p className="font-extrabold text-xs text-white leading-tight">Fast Delivery</p>
              <p className="text-[10px] text-slate-300 font-medium">On Time, Every Time</p>
            </div>

            {/* 4. Secure */}
            <div className="flex flex-col items-center justify-center space-y-1 px-1">
              <div className="w-9 h-9 rounded-lg bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center text-[#c59b27] mb-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <p className="font-extrabold text-xs text-white leading-tight">Secure Payments</p>
              <p className="text-[10px] text-slate-300 font-medium">100% Safe & Secure</p>
            </div>
          </div>

          {/* Location & Phone Bar */}
          <div className="bg-[#031b1a]/90 backdrop-blur-sm rounded-xl px-5 py-2.5 border border-[#0d4a47]/70 flex items-center justify-between text-xs text-slate-200">
            <div className="flex items-center gap-2 font-semibold">
              <MapPin className="w-4 h-4 text-[#c59b27]" />
              <span>Bhagwanpur Hat, Siwan, Bihar – 841408</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-white">
              <Phone className="w-4 h-4 text-[#c59b27]" />
              <a href="tel:+918796020860" className="hover:text-[#c59b27] transition">+91 87960 20860</a>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: AUTH FORM CARD (Floating Luxury Curved Panel) */}
      <div className="relative flex-1 lg:max-w-xl xl:max-w-2xl flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 z-20">
        {/* Mobile / Tablet Top Branding (Shown on small screens) */}
        <div className="lg:hidden flex flex-col items-center text-center mb-6">
          <Logo size="md" white />
          <p className="text-xs text-slate-300 font-medium mt-1">Everything You Need, All in One Place</p>
        </div>

        {/* Main Floating Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`w-full ${isWide ? "max-w-xl" : "max-w-md"} bg-[#062524]/95 backdrop-blur-2xl rounded-3xl p-7 sm:p-9 border border-[#c59b27]/30 shadow-2xl flex flex-col relative overflow-hidden`}
        >
          {/* Subtle Ambient Gold Gradient in Card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#c59b27]/10 blur-2xl pointer-events-none" />

          {/* Top House Logo Icon */}
          <div className="flex flex-col items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#031716] border border-[#c59b27]/40 flex items-center justify-center shadow-lg mb-2">
              <CeramicLogoIcon className="w-8 h-8" isWhite={false} />
            </div>

            {/* Decorative Gold Accent Lines */}
            <div className="flex items-center justify-center gap-2 w-full max-w-[200px] my-1">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c59b27]/60 to-transparent" />
              <span className="text-[#c59b27] text-xs">◆</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c59b27]/60 to-transparent" />
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          <div className="mt-4">
            {children}
          </div>

          {/* Bottom Card Decorative Line & Copyright */}
          <div className="mt-6 pt-4 border-t border-[#0d4a47]/70 text-center">
            <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
              <span className="text-[#c59b27]">✦</span>
              <span>© 2026 Ceramic Bazaar. All Rights Reserved.</span>
              <span className="text-[#c59b27]">✦</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
