"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Shield, Loader2, Eye, EyeOff, Phone, Store, MapPin, FileText } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/site/auth-shell";
import { Button } from "@/components/ui/button";
import { SECURITY_QUESTIONS } from "@/lib/format";

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"CUSTOMER" | "DEALER">("CUSTOMER");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    shopName: "",
    shopAddress: "",
    gstNumber: "",
    securityQuestion: SECURITY_QUESTIONS[0],
    securityAnswer: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (accountType === "DEALER" && (!form.shopName.trim() || !form.shopAddress.trim())) {
      toast.error("Shop Name and Shop Address are required for Dealers");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          role: accountType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "Signup failed");
        return;
      }

      if (accountType === "DEALER" && data?.status === "PENDING") {
        toast.success(data?.message || "Dealer account registered! Admin will verify and approve your account shortly.");
        router.replace("/login");
        return;
      }

      toast.success("Account created! Signing you in...");
      const signInRes = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (signInRes?.error) {
        router.replace("/login");
      } else {
        if (accountType === "DEALER") {
          router.replace("/dealer");
        } else {
          router.replace("/home");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create Account"
      subtitle="Join Ceramic Bazaar as Customer or Authorized Dealer"
      isWide={accountType === "DEALER"}
    >
      <div className="space-y-4">
        {/* Account Type Selection Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-[#021817] p-1.5 rounded-2xl border border-slate-700/80">
          <button
            type="button"
            onClick={() => setAccountType("CUSTOMER")}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
              accountType === "CUSTOMER"
                ? "bg-[#c59b27] text-slate-950 shadow-md"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setAccountType("DEALER")}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
              accountType === "DEALER"
                ? "bg-[#c59b27] text-slate-950 shadow-md"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Store className="h-4 w-4" />
            <span>Dealer</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="Full Name"
              className="w-full h-12 rounded-xl bg-[#021817]/90 border border-slate-700/80 pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Email Address"
                className="w-full h-12 rounded-xl bg-[#021817]/90 border border-slate-700/80 pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27]"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="Mobile (10 digits)"
                className="w-full h-12 rounded-xl bg-[#021817]/90 border border-slate-700/80 pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27]"
              />
            </div>
          </div>

          {/* Dealer Specific Fields */}
          {accountType === "DEALER" && (
            <>
              <div className="relative">
                <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#c59b27]" />
                <input
                  required
                  value={form.shopName}
                  onChange={(e) => update("shopName", e.target.value)}
                  placeholder="Shop Name"
                  className="w-full h-12 rounded-xl bg-[#021817]/90 border border-[#c59b27]/40 pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-400 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27]"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#c59b27]" />
                <input
                  required
                  value={form.shopAddress}
                  onChange={(e) => update("shopAddress", e.target.value)}
                  placeholder="Shop Address"
                  className="w-full h-12 rounded-xl bg-[#021817]/90 border border-[#c59b27]/40 pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-400 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27]"
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={show ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Password"
                className="w-full h-12 rounded-xl bg-[#021817]/90 border border-slate-700/80 pl-11 pr-10 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27]"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={show ? "text" : "password"}
                required
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                placeholder="Confirm Password"
                className="w-full h-12 rounded-xl bg-[#021817]/90 border border-slate-700/80 pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27]"
              />
            </div>
          </div>

          <div className="relative">
            <Shield className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 z-10" />
            <select
              required
              value={form.securityQuestion}
              onChange={(e) => update("securityQuestion", e.target.value)}
              className="w-full h-12 rounded-xl bg-[#021817]/90 border border-slate-700/80 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-[#c59b27] appearance-none cursor-pointer"
            >
              {SECURITY_QUESTIONS.map((q) => (
                <option key={q} value={q} className="bg-[#021817] text-white">
                  {q}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              required
              value={form.securityAnswer}
              onChange={(e) => update("securityAnswer", e.target.value)}
              placeholder="Security Answer"
              className="w-full h-12 rounded-xl bg-[#021817]/90 border border-slate-700/80 pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#c59b27] via-[#d4af37] to-[#b38820] hover:brightness-110 active:scale-[0.99] text-slate-950 font-black text-base rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : accountType === "DEALER" ? (
                "Register as Dealer"
              ) : (
                "Create Customer Account"
              )}
            </button>
          </div>

          <div className="text-center text-xs sm:text-sm text-slate-300 font-medium pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#c59b27] hover:text-[#d4af37] font-black underline underline-offset-4 ml-1 transition"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
