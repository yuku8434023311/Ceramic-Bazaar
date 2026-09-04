"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Shield, Lock, Loader2, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/site/auth-shell";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const requestQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "question", email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "Failed");
        return;
      }
      setQuestion(data.securityQuestion);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "reset", email, answer, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "Failed");
        return;
      }
      setStep(3);
      toast.success("Password reset successfully");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset Password"
      subtitle={
        step === 1
          ? "Enter your email to begin recovery"
          : step === 2
          ? "Answer your security question"
          : "Password updated successfully"
      }
    >
      {step === 1 && (
        <form onSubmit={requestQuestion} className="space-y-4">
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
                className="w-full h-12 rounded-xl bg-[#021817]/90 border border-slate-700/80 pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27]"
              />
            </div>
          </div>
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
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={resetPassword} className="space-y-3.5">
          <div className="bg-[#021817] rounded-xl p-3.5 border border-slate-700/80 text-sm text-white">
            <p className="text-xs text-[#c59b27] font-bold mb-1">Security Question</p>
            <p className="font-semibold">{question}</p>
          </div>

          <div className="relative">
            <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your Answer"
              className="w-full h-12 rounded-xl bg-[#021817]/90 border border-slate-700/80 pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full h-12 rounded-xl bg-[#021817]/90 border border-slate-700/80 pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full h-12 rounded-xl bg-[#021817]/90 border border-slate-700/80 pl-11 pr-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#c59b27] via-[#d4af37] to-[#b38820] hover:brightness-110 active:scale-[0.99] text-slate-950 font-black text-base rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="text-center space-y-4 py-2">
          <div className="mx-auto h-16 w-16 rounded-full bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center">
            <CheckCircle className="h-9 w-9 text-[#c59b27]" />
          </div>
          <p className="text-white font-bold text-base">Your password has been reset successfully.</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full h-12 bg-gradient-to-r from-[#c59b27] via-[#d4af37] to-[#b38820] hover:brightness-110 active:scale-[0.99] text-slate-950 font-black text-base rounded-xl shadow-xl flex items-center justify-center transition-all cursor-pointer"
          >
            Back to Login
          </button>
        </div>
      )}

      <div className="text-center text-xs sm:text-sm text-slate-300 font-medium pt-3">
        Remember it?{" "}
        <Link
          href="/login"
          className="text-[#c59b27] hover:text-[#d4af37] font-black underline underline-offset-4 ml-1 transition"
        >
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
}

