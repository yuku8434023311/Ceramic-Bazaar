"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, AlertTriangle, ShieldCheck, Sparkles, X } from "lucide-react";

export function InAppUpdateModal() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isClosedByUser, setIsClosedByUser] = useState(false);
  const [latestVersionData, setLatestVersionData] = useState<{
    version: string;
    minVersion: string;
    apkUrl: string;
    releaseNotes: string;
  } | null>(null);

  useEffect(() => {
    async function checkAppVersion() {
      try {
        const res = await fetch("/api/app-version", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        setLatestVersionData(data);

        const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";

        // STRICT Android Native APK Detection
        const isNativeApp =
          typeof window !== "undefined" &&
          (Boolean((window as any).Capacitor?.isNativePlatform?.()) ||
            ua.includes("ElectroBazaarNativeAPK") ||
            (ua.includes("wv") && ua.includes("Android")) ||
            (window as any).isAndroidNativeApp === true);

        // If user is visiting via normal Web Browser (Chrome/Safari), NEVER show APK update modal!
        if (!isNativeApp) {
          setUpdateAvailable(false);
          return;
        }

        let installedVersion = "1.0.0"; // Default version for legacy APKs

        // Extract version tag from UserAgent if available
        const match = ua.match(/ElectroBazaarNativeAPK\/([\d.]+)/);
        if (match && match[1]) {
          installedVersion = match[1];
        } else {
          const stored = localStorage.getItem("eb_installed_apk_version");
          if (stored) installedVersion = stored;
        }

        // Helper semver comparer (returns true if installed < required)
        const isOutdated = (installed: string, target: string) => {
          const instParts = installed.split(".").map(Number);
          const targParts = target.split(".").map(Number);
          for (let i = 0; i < 3; i++) {
            const inst = instParts[i] || 0;
            const targ = targParts[i] || 0;
            if (inst < targ) return true;
            if (inst > targ) return false;
          }
          return false;
        };

        // Show update popup if installed < latest version
        if (data.version && isOutdated(installedVersion, data.version)) {
          setUpdateAvailable(true);
        } else {
          setUpdateAvailable(false);
        }
      } catch (err) {
        console.error("Failed to check app version:", err);
      }
    }

    checkAppVersion();
  }, []);

  const handleClose = () => {
    setIsClosedByUser(true);
    setUpdateAvailable(false);
  };

  const handleStartDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const apkUrl = latestVersionData?.apkUrl || "https://electrobazaars.com/app-release.apk";

    if (latestVersionData?.version) {
      localStorage.setItem("eb_installed_apk_version", latestVersionData.version);
    }

    try {
      window.location.href = apkUrl;
    } catch {
      window.open(apkUrl, "_system");
    }
  };

  if (!updateAvailable || isClosedByUser || !latestVersionData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Decorative Gradient Banner */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-500 via-rose-500 to-sky-500" />

          {/* Top-Right Cancel (X) Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label="Close update modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon Badge */}
          <div className="mx-auto h-16 w-16 rounded-3xl bg-amber-500/10 text-amber-500 dark:bg-amber-400/20 dark:text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20 shadow-inner mt-2">
            <Sparkles className="h-8 w-8 text-amber-500" />
          </div>

          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 font-extrabold text-[11px] rounded-full uppercase tracking-wider mb-2">
            Update Available
          </span>

          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            New App Version v{latestVersionData.version}
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
            A new version of **Ceramic Bazaar App** is available. Update now for improved performance, new features, and bug fixes.
          </p>

          {/* Release Features Card */}
          <div className="my-4 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-left border border-slate-200 dark:border-slate-700/60">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" /> What's New in v{latestVersionData.version}:
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold">
              {latestVersionData.releaseNotes || "Direct WhatsApp Support, 100% Error Fixes & Speed Improvements."}
            </p>
          </div>

          {/* Action Buttons: Update Now & Remind Later */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              Remind Later
            </button>

            <button
              type="button"
              onClick={handleStartDownload}
              className="py-3 px-4 bg-[#062524] hover:bg-[#0c3f3d] text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4 text-[#c59b27]" />
              <span>Update Now</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 font-medium flex items-center justify-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Safe & Verified APK Download
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
