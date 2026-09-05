"use client";

import Link from "next/link";
import { Logo } from "./logo";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="hidden md:block bg-[#041c1b] text-slate-300 border-t border-[#062e2c] pt-14 pb-8 w-full max-w-full overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-[#083533]">
          {/* Column 1: Brand & About */}
          <div className="lg:col-span-1 space-y-4">
            <Logo white size="md" />
            <p className="text-sm text-[#c59b27] font-bold tracking-wide">
              • Everything You Need, All in One Place. •
            </p>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              We are your one-stop destination for 100% genuine CERA sanitaryware,
              luxury one-piece EWCs, wall-hung toilets, designer wash basins, and bathroom
              suites at wholesale prices.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-[#083230] border border-[#0d4a47] flex items-center justify-center text-slate-300 hover:text-[#c59b27] hover:border-[#c59b27] transition shadow"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#083230] border border-[#0d4a47] flex items-center justify-center text-slate-300 hover:text-[#c59b27] hover:border-[#c59b27] transition shadow"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-[#083230] border border-[#0d4a47] flex items-center justify-center text-slate-300 hover:text-[#c59b27] hover:border-[#c59b27] transition shadow"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919315309289"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-[#083230] border border-[#0d4a47] flex items-center justify-center text-slate-300 hover:text-[#c59b27] hover:border-[#c59b27] transition shadow"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-black text-sm tracking-wider mb-4 uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300 font-medium">
              <li>
                <Link href="/home" className="hover:text-[#c59b27] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#c59b27] transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-[#c59b27] transition">
                  Offers
                </Link>
              </li>
              <li>
                <Link href="/products?filter=new" className="hover:text-[#c59b27] transition">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/support#about" className="hover:text-[#c59b27] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#c59b27] transition">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#c59b27] transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/support#faq" className="hover:text-[#c59b27] transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/support#contact" className="hover:text-[#c59b27] transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/download" className="text-[#c59b27] font-bold hover:text-white transition flex items-center gap-1.5">
                  <span>📱 Download Android App</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="text-white font-black text-sm tracking-wider mb-4 uppercase">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300 font-medium">
              <li>
                <Link href="/products?category=sanitary-ware" className="hover:text-[#c59b27] transition font-bold text-white">
                  Sanitaryware
                </Link>
              </li>
              <li>
                <Link href="/products?category=wash-basins" className="hover:text-[#c59b27] transition font-bold text-white">
                  Wash Basins
                </Link>
              </li>
              <li>
                <Link href="/products?search=One-Piece" className="hover:text-[#c59b27] transition">
                  One-Piece Toilets
                </Link>
              </li>
              <li>
                <Link href="/products?search=Wall-Hung" className="hover:text-[#c59b27] transition">
                  Wall-Hung EWCs
                </Link>
              </li>
              <li>
                <Link href="/products?search=Table+Top" className="hover:text-[#c59b27] transition">
                  Table Top Basins
                </Link>
              </li>
              <li>
                <Link href="/products?search=Pedestal" className="hover:text-[#c59b27] transition">
                  Pedestal Basins
                </Link>
              </li>
              <li>
                <Link href="/products?search=Urinal" className="hover:text-[#c59b27] transition">
                  Urinals & Cisterns
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Support */}
          <div>
            <h3 className="text-white font-black text-sm tracking-wider mb-4 uppercase">
              Customer Support
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300 font-medium">
              <li>
                <Link href="/support" className="hover:text-[#c59b27] transition">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#c59b27] transition">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#c59b27] transition">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#c59b27] transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#c59b27] transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-white font-black text-sm tracking-wider mb-4 uppercase">
              Contact Information
            </h3>
            <div className="flex items-start gap-3 text-sm text-slate-300 font-medium">
              <MapPin className="w-5 h-5 text-[#c59b27] shrink-0 mt-0.5" />
              <span>Bhagwanpur Hat, Siwan, Bihar – 841408</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
              <Phone className="w-5 h-5 text-[#c59b27] shrink-0" />
              <a href="tel:+919315309289" className="hover:text-[#c59b27] transition">+91 93153 09289</a>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
              <Mail className="w-5 h-5 text-[#c59b27] shrink-0" />
              <a href="mailto:ceramicbazaar0@gmail.com" className="hover:text-[#c59b27] transition">ceramicbazaar0@gmail.com</a>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-300 font-medium">
              <Clock className="w-5 h-5 text-[#c59b27] shrink-0 mt-0.5" />
              <span>Mon - Sat : 9:00 AM - 8:00 PM</span>
            </div>
          </div>
        </div>

        {/* Copyright Bottom Bar */}
        <div className="pt-6 text-center text-sm font-medium text-slate-400">
          © 2026 Ceramic Bazaar. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

