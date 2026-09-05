"use client";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, MapPin, Package, LogOut, Edit3, Save, X, Shield, Fingerprint, Key, Smartphone, Download } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

export default function ProfilePage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", image: "" });

  const [isApk, setIsApk] = useState(false);
  const [lockEnabled, setLockEnabled] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  // Check APK state and load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isCapacitor = (window as any).Capacitor !== undefined;
      setIsApk(isCapacitor);

      if (isCapacitor) {
        setLockEnabled(localStorage.getItem("app_lock_enabled") === "true");

        if (window.PublicKeyCredential) {
          PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
            .then(available => setBiometricsAvailable(available))
            .catch(() => setBiometricsAvailable(false));
        }
      }
    }
  }, []);

  const handleToggleLock = async () => {
    if (lockEnabled) {
      localStorage.setItem("app_lock_enabled", "false");
      localStorage.setItem("app_lock_biometrics_enabled", "false");
      localStorage.removeItem("app_lock_credential_id");
      setLockEnabled(false);
      toast.success("App lock disabled");
    } else {
      await registerBiometrics();
    }
  };

  const registerBiometrics = async () => {
    if (!window.PublicKeyCredential) {
      toast.error("Biometrics not supported on this device.");
      return;
    }

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        toast.error("Screen lock/biometrics not set up on this device. Please set up a screen lock (Fingerprint/Face/PIN) in your phone settings first.");
        return;
      }

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const userId = "user_" + Math.random().toString(36).substring(2);

      const createOptions: CredentialCreationOptions = {
        publicKey: {
          challenge,
          rp: { name: "Electro Bazaar", id: window.location.hostname },
          user: {
            id: new TextEncoder().encode(userId),
            name: user?.email || "user@electrobazaar",
            displayName: user?.fullName || "Electro Bazaar User"
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 }
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000
        }
      };

      (window as any).appLockAuthenticating = true;

      const credential = await navigator.credentials.create(createOptions) as PublicKeyCredential;
      if (credential) {
        const rawId = credential.rawId;
        const base64Id = btoa(String.fromCharCode(...new Uint8Array(rawId)));
        localStorage.setItem("app_lock_credential_id", base64Id);
        localStorage.setItem("app_lock_biometrics_enabled", "true");
        localStorage.setItem("app_lock_enabled", "true");
        setLockEnabled(true);
        toast.success("Biometric App Lock enabled successfully!");
      }
    } catch (err: any) {
      console.error("[Biometrics] Registration error:", err);
      if (err.name !== "NotAllowedError" && err.name !== "AbortError") {
        toast.error("Biometric registration failed: " + err.message);
      }
    } finally {
      setTimeout(() => {
        (window as any).appLockAuthenticating = false;
      }, 1000);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/profile");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/profile").then(r => r.ok ? r.json() : null).then(d => { 
      setUser(d); 
      setForm({ fullName: d?.fullName ?? "", phone: d?.phone ?? "", image: d?.image ?? "" }); 
    }).finally(() => setLoading(false));
  }, [status]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        toast.error("Image must be smaller than 800KB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const save = async () => {
    const res = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { 
      const u = await res.json(); 
      setUser(u); 
      setForm({ fullName: u?.fullName ?? "", phone: u?.phone ?? "", image: u?.image ?? "" });
      setEdit(false); 
      toast.success("Profile updated"); 
    }
  };

  if (loading) return <div className="mx-auto max-w-[1200px] px-4 py-12 text-center text-muted-foreground">Loading profile...</div>;

  return (
    <div className="mx-auto max-w-[900px] px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-6">My Profile</h1>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl p-6 mb-5">
        <div className="flex items-center gap-4">
          <label className={`relative group ${edit ? "cursor-pointer" : ""}`}>
            <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden border-2 border-white/40">
              {edit ? (
                form.image ? (
                  <img src={form.image} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8" />
                )
              ) : user?.image ? (
                <img src={user.image} className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8" />
              )}
            </div>
            {edit && (
              <>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 className="h-4 w-4 text-white" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </>
            )}
          </label>
          <div className="min-w-0">
            <h2 className="font-display font-bold text-2xl tracking-tight">{user?.fullName}</h2>
            <p className="text-white/80 text-sm">{user?.email}</p>
            <p className="text-white/70 text-xs">Member since {formatDate(user?.createdAt)}</p>
          </div>
        </div>
      </motion.div>

      <section className="bg-card rounded-xl p-5 product-card-shadow mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg">Personal Information</h2>
          {!edit ? <Button variant="outline" size="sm" onClick={() => setEdit(true)}><Edit3 className="h-3.5 w-3.5 mr-1.5" />Edit</Button> : (
            <div className="flex gap-2"><Button size="sm" onClick={save}><Save className="h-3.5 w-3.5 mr-1.5" />Save</Button><Button variant="outline" size="sm" onClick={() => { setEdit(false); setForm({ fullName: user?.fullName ?? "", phone: user?.phone ?? "", image: user?.image ?? "" }); }}><X className="h-3.5 w-3.5" /></Button></div>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            {edit ? <input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" /> : <p className="text-sm">{user?.fullName}</p>}
          </div>
          <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><p className="text-sm">{user?.email}</p></div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            {edit ? <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value.replace(/[^0-9]/g, "")})} placeholder="Add phone number" maxLength={10} className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" /> : <p className="text-sm">{user?.phone || <span className="text-muted-foreground">Not added</span>}</p>}
          </div>
        </div>
      </section>

      {isApk && biometricsAvailable && (
        <section className="bg-card rounded-xl p-5 product-card-shadow mb-4 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-sky-500" />
            <h2 className="font-display font-bold text-lg text-foreground">App Security & Lock</h2>
          </div>
          
          <div className="space-y-4">
            {/* Biometric Toggle */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold text-foreground">Biometric Unlock (Fingerprint / Face ID)</p>
                <p className="text-xs text-muted-foreground">Protect the app and unlock instantly using your phone's biometrics</p>
              </div>
              <button
                type="button"
                onClick={handleToggleLock}
                className={`w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none relative ${
                  lockEnabled ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-200 shadow-sm ${
                    lockEnabled ? "translate-x-5.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* App Download Card */}
      {!isApk && (
        <section className="bg-gradient-to-r from-[#031716] to-[#062524] text-white rounded-2xl p-5 mb-4 border border-[#0d4a47] shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#c59b27] text-slate-950 flex items-center justify-center shrink-0 shadow">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
                <span>Download Ceramic Bazaar Android App</span>
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Shop with 60FPS fluid experience, live order alerts & wholesale rates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="/ceramic-bazaar.apk"
              download="ceramic-bazaar.apk"
              className="bg-[#c59b27] hover:bg-[#b38820] text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span>Download APK (9.7 MB)</span>
            </a>
            <Link
              href="/download"
              className="border border-slate-600 hover:border-white text-white font-bold text-xs px-3 py-2.5 rounded-xl text-center whitespace-nowrap"
            >
              QR & Guide
            </Link>
          </div>
        </section>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <Link href="/orders" className="bg-card rounded-xl p-4 product-card-shadow flex items-center gap-3 hover:-translate-y-0.5 transition">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Package className="h-5 w-5" /></div>
          <div className="flex-1"><p className="font-semibold text-sm">My Orders</p><p className="text-xs text-muted-foreground">View order history</p></div>
        </Link>
        <Link href="/profile/addresses" className="bg-card rounded-xl p-4 product-card-shadow flex items-center gap-3 hover:-translate-y-0.5 transition">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><MapPin className="h-5 w-5" /></div>
          <div className="flex-1"><p className="font-semibold text-sm">Addresses</p><p className="text-xs text-muted-foreground">Manage delivery locations</p></div>
        </Link>
      </div>

      <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/login" })} className="w-full mt-4"><LogOut className="h-4 w-4 mr-2" />Logout</Button>
    </div>
  );
}
