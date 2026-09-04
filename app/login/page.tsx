"use client";
import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/site/auth-shell";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callback = params?.get("callbackUrl") ?? "/home";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await signIn("credentials", { 
        email: cleanEmail, 
        password, 
        redirect: false 
      });

      if (res?.error) {
        if (res.error.includes("SUSPENDED:")) {
          const reason = res.error.split("SUSPENDED:")[1]?.trim();
          toast.error(`Account suspended: ${reason}`, { duration: 6000 });
        } else {
          toast.error("Invalid email or password");
        }
      } else {
        toast.success("Welcome back!");
        // Fetch session to determine role accurately
        const session = await getSession();
        const role = (session?.user as any)?.role;

        if (role === "ADMIN") {
          window.location.href = "/admin";
        } else if (role === "DEALER") {
          window.location.href = "/dealer";
        } else {
          window.location.href = callback && callback !== "/login" ? callback : "/home";
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to continue shopping">
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-slate-200 block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-12 rounded-xl bg-[#021817]/90 border border-slate-700/80 pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] transition shadow-inner"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-slate-200 block">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type={showPw ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-12 rounded-xl bg-[#021817]/90 border border-slate-700/80 pl-11 pr-11 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] transition shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
          <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded accent-[#c59b27] bg-[#021817] border-slate-600 cursor-pointer"
            />
            <span>Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-[#c59b27] hover:text-[#d4af37] font-bold hover:underline transition"
          >
            Forgot password?
          </Link>
        </div>

        {/* Primary Submit Button: Metallic Gold Sign In */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-[#c59b27] via-[#d4af37] to-[#b38820] hover:brightness-110 active:scale-[0.99] text-slate-950 font-black text-base rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom Signup Link */}
        <div className="text-center text-xs sm:text-sm text-slate-300 font-medium pt-2">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-[#c59b27] hover:text-[#d4af37] font-black underline underline-offset-4 ml-1 transition"
          >
            Create one
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

