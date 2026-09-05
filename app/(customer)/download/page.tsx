"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Download,
  Smartphone,
  ShieldCheck,
  Zap,
  Bell,
  Truck,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  QrCode,
  ArrowRight,
  ChevronRight,
  Phone,
  Mail,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AppDownloadPage() {
  const [downloading, setDownloading] = useState(false);
  const apkDownloadUrl = "/ceramic-bazaar.apk";
  const apkSize = "9.7 MB";

  const handleDownload = () => {
    setDownloading(true);
    toast.success("Starting Ceramic Bazaar APK download...");
    try {
      const link = document.createElement("a");
      link.href = apkDownloadUrl;
      link.download = "ceramic-bazaar.apk";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.location.href = apkDownloadUrl;
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Download Ceramic Bazaar Android App",
          text: "Get 100% Genuine CERA Sanitaryware & Wash Basins at Direct Wholesale Factory Prices on the Ceramic Bazaar App!",
          url: shareUrl,
        });
      } catch (_) {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Download link copied to clipboard!");
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-[#f8faf9] text-slate-900 pb-20">
      {/* Breadcrumb */}
      <div className="bg-[#031716] text-slate-300 py-3 px-4 sm:px-8 border-b border-[#062e2c]">
        <div className="mx-auto max-w-[1200px] flex items-center gap-2 text-xs font-semibold">
          <Link href="/home" className="hover:text-[#c59b27] transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[#c59b27]">Download Android App</span>
        </div>
      </div>

      {/* Main Hero Card */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="bg-[#062524] text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#0d4a47] shadow-2xl relative overflow-hidden">
          {/* Ambient Gold Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#c59b27]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#0c3f3d] rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headline, Specs & Download CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#c59b27] bg-[#c59b27]/20 px-3.5 py-1.5 rounded-full border border-[#c59b27]/40 shadow-sm">
                <Sparkles className="w-4 h-4 text-[#c59b27]" />
                Official Android App Release
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight uppercase text-white">
                Download <span className="text-[#c59b27]">Ceramic Bazaar</span> App
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
                Shop all 246+ official CERA sanitaryware, luxury one-piece toilets, and designer wash basins directly from your Android phone with wholesale factory prices & superfast delivery.
              </p>

              {/* App Info Chips */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold text-slate-300">
                <span className="bg-[#031716] px-3 py-1.5 rounded-lg border border-[#0d4a47] text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#c59b27]" /> Android 7.0+
                </span>
                <span className="bg-[#031716] px-3 py-1.5 rounded-lg border border-[#0d4a47] text-white">
                  Package Size: <strong className="text-[#c59b27]">{apkSize}</strong>
                </span>
                <span className="bg-[#031716] px-3 py-1.5 rounded-lg border border-[#0d4a47] text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Virus-Free & Safe
                </span>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="h-14 px-8 rounded-2xl bg-[#c59b27] hover:bg-[#b38820] text-slate-950 font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 border-none"
                >
                  <Download className="w-6 h-6 shrink-0" />
                  <span>{downloading ? "Downloading APK..." : "Download APK (.apk)"}</span>
                </Button>

                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="h-14 px-6 rounded-2xl border-2 border-white/40 hover:border-white hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
                >
                  <Share2 className="w-5 h-5 text-[#c59b27]" />
                  <span>Share App</span>
                </Button>
              </div>

              <p className="text-xs text-slate-400">
                Direct file link:{" "}
                <a
                  href={apkDownloadUrl}
                  download="ceramic-bazaar.apk"
                  className="text-[#c59b27] underline font-mono hover:text-white"
                >
                  /ceramic-bazaar.apk
                </a>
              </p>
            </div>

            {/* Right Column: QR Code + Phone Preview Box */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#c59b27] flex flex-col items-center text-center max-w-xs w-full">
                <div className="w-12 h-12 rounded-2xl bg-[#062524] text-[#c59b27] flex items-center justify-center font-black text-2xl shadow-md mb-3">
                  <QrCode className="w-7 h-7" />
                </div>

                <h2 className="text-lg font-black text-slate-900 leading-tight">
                  Scan to Download on Mobile
                </h2>
                <p className="text-xs text-slate-500 mt-1 mb-4 font-semibold">
                  Point your phone camera to download directly
                </p>

                {/* Live QR Code Generator Image for Current APK */}
                <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-inner mb-4">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fceramic-bazaar.vercel.app%2Fceramic-bazaar.apk"
                    alt="Scan QR Code to Download Ceramic Bazaar APK"
                    className="w-40 h-40 object-contain rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Official CERA Build
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Installation Guide */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How to Install the APK in 3 Easy Steps
          </h2>
          <p className="text-sm text-slate-600 font-semibold mt-1">
            Follow these simple steps on your Android device to install and enjoy Ceramic Bazaar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative hover:border-[#c59b27] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#062524] text-[#c59b27] font-black text-lg flex items-center justify-center mb-4 shadow">
              1
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">
              Tap "Download APK"
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Click the download button on this page to download the <strong className="text-slate-800">ceramic-bazaar.apk</strong> file to your device.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative hover:border-[#c59b27] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#062524] text-[#c59b27] font-black text-lg flex items-center justify-center mb-4 shadow">
              2
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">
              Allow "Download Anyway"
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Android browsers (like Chrome) may show a security notice: <em className="text-slate-800 font-semibold">"File might be harmful"</em>. Tap <strong className="text-emerald-700">"Download anyway"</strong>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative hover:border-[#c59b27] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#062524] text-[#c59b27] font-black text-lg flex items-center justify-center mb-4 shadow">
              3
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">
              Open & Install
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Tap the downloaded file from notifications or Downloads folder and tap <strong className="text-slate-800">"Install"</strong>. If prompted, toggle <em className="text-slate-800 font-semibold">"Allow from this source"</em>.
            </p>
          </div>
        </div>
      </section>

      {/* App Features & Perks */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 text-center">
            Why Shop on Ceramic Bazaar App?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#062524]/10 text-[#062524] flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-[#c59b27]" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">Lightning Fast</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-relaxed">
                  Smooth 60FPS browsing and instant zero-delay checkout.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#062524]/10 text-[#062524] flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-[#c59b27]" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">Live Notifications</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-relaxed">
                  Instant order status, OTP verification, and dispatch updates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#062524]/10 text-[#062524] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#c59b27]" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">100% Genuine CERA</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-relaxed">
                  Direct warranty, original barcodes & authorized showroom stock.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#062524]/10 text-[#062524] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#c59b27]" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">Direct Factory Rates</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-relaxed">
                  Unbeatable wholesale rates for homeowners, builders & dealers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Help Banner */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-[#031716] text-white rounded-2xl p-6 border border-[#083533] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="font-black text-base text-white">Need help downloading or installing?</h3>
            <p className="text-xs text-slate-400 mt-0.5">Our support team is available on WhatsApp and phone calls to assist you.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+919315309289"
              className="bg-[#c59b27] hover:bg-[#b38820] text-slate-950 font-black text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow"
            >
              <Phone className="w-4 h-4" />
              <span>+91 93153 09289</span>
            </a>
            <a
              href="mailto:ceramicbazaar0@gmail.com"
              className="border border-slate-600 hover:border-white text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
