"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Film,
  Plus,
  Trash2,
  Edit,
  Eye,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Tag,
  FileText,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    mediaType: "IMAGE" as "IMAGE" | "VIDEO",
    mediaUrl: "",
    targetUrl: "/products",
    buttonText: "Shop Now",
    badgeText: "SPECIAL DEAL",
    orderIndex: "1",
    durationSeconds: "3",
    active: true,
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      if (res.ok) {
        setBanners(data.banners || []);
      } else {
        toast.error(data.error || "Failed to load banners");
      }
    } catch {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (form.mediaType === "VIDEO" && file.size > 50 * 1024 * 1024) {
      toast.error("Video file is larger than 50MB limit. Please upload an optimized WebM/MP4 video (10MB - 30MB recommended).");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && (data.url || data.urls?.[0])) {
        const uploadedUrl = data.url || data.urls[0];
        const isVideoFile =
          file.type.startsWith("video/") ||
          file.name.toLowerCase().endsWith(".mp4") ||
          file.name.toLowerCase().endsWith(".webm") ||
          file.name.toLowerCase().endsWith(".mov");
        const detectedType = isVideoFile ? "VIDEO" : form.mediaType;

        setForm((prev) => ({
          ...prev,
          mediaUrl: uploadedUrl,
          mediaType: detectedType,
        }));
        toast.success(`${detectedType === "VIDEO" ? "Video" : "Banner image"} uploaded successfully!`);
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mediaUrl.trim()) {
      toast.error("Media file (video or banner image) is required");
      return;
    }

    try {
      const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : "/api/admin/banners";
      const method = editingBanner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Slide saved successfully!");
        setShowModal(false);
        setEditingBanner(null);
        resetForm();
        fetchBanners();
      } else {
        toast.error(data.error || "Failed to save slide");
      }
    } catch {
      toast.error("Error saving slide");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Slide deleted!");
        fetchBanners();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      mediaType: "IMAGE",
      mediaUrl: "",
      targetUrl: "/products",
      buttonText: "Shop Now",
      badgeText: "SPECIAL DEAL",
      orderIndex: String(banners.length + 1),
      durationSeconds: "3",
      active: true,
    });
  };

  const openAddModal = () => {
    setEditingBanner(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (b: any) => {
    setEditingBanner(b);
    setForm({
      title: b.title || "",
      description: b.description || "",
      mediaType: b.mediaType || "IMAGE",
      mediaUrl: b.mediaUrl || "",
      targetUrl: b.targetUrl || "/products",
      buttonText: b.buttonText || "Shop Now",
      badgeText: b.badgeText || "SPECIAL DEAL",
      orderIndex: String(b.orderIndex || 1),
      durationSeconds: String(b.durationSeconds || 3),
      active: b.active !== false,
    });
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Film className="h-7 w-7 text-sky-600 dark:text-sky-400" />
              <span>Hero Banners & Video Manager</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-300 mt-1 font-medium">
              Manage dynamic homepage video slides, animated GIFs, and banner images with product target links.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={fetchBanners} variant="outline" size="sm" className="gap-2 font-bold dark:bg-slate-800 dark:text-white">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
            <Button onClick={openAddModal} className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold gap-2">
              <Plus className="h-4 w-4" /> Add Video / Banner Slide
            </Button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 p-4 rounded-xl text-sky-900 dark:text-sky-200 text-xs sm:text-sm leading-relaxed space-y-1">
          <div className="font-extrabold flex items-center gap-1.5 text-sky-700 dark:text-sky-300">
            <Sparkles className="h-4 w-4" /> Recommended Media Guidelines:
          </div>
          <p>• <strong>Video Format</strong>: MP4 / WebM video files (10MB - 30MB recommended for superfast loading, max 50MB).</p>
          <p>• <strong>Image Format</strong>: High Resolution JPG / PNG / GIF (1920x600 px recommended for desktop, auto-fits mobile & tablet).</p>
          <p>• <strong>Product Target URL</strong>: Enter the exact product page URL (e.g. <code>/products/samsung-s24</code>). When customers click the video or banner, it opens that product page!</p>
        </div>

        {/* Banner Cards Grid */}
        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">Loading Hero Slides...</div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Film className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <div className="font-bold text-base text-slate-800 dark:text-slate-200">No Custom Hero Slides Created Yet</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">The website homepage will display default high-quality banners until you upload your custom videos/banners.</p>
            <Button onClick={openAddModal} className="bg-sky-600 hover:bg-sky-700 text-white font-bold gap-2">
              <Plus className="h-4 w-4" /> Add First Slide Now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Media Container */}
                <div className="relative aspect-[16/7] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                  {b.mediaType === "VIDEO" ? (
                    <video
                      src={b.mediaUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={b.mediaUrl}
                      alt={b.title || "Banner"}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Overlays */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-black/70 backdrop-blur text-white text-xs font-black px-2.5 py-1 rounded-md flex items-center gap-1">
                      {b.mediaType === "VIDEO" ? <Video className="h-3.5 w-3.5 text-amber-400" /> : <ImageIcon className="h-3.5 w-3.5 text-sky-400" />}
                      <span>{b.mediaType}</span>
                    </span>

                    <span className="bg-sky-600 text-white text-xs font-black px-2.5 py-1 rounded-md">
                      Order #{b.orderIndex || 1}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {b.active !== false ? (
                      <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">ACTIVE</span>
                    ) : (
                      <span className="bg-slate-700 text-slate-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">DRAFT</span>
                    )}
                  </div>
                </div>

                {/* Banner Info */}
                <div className="p-4 space-y-2 flex-1">
                  {b.badgeText && (
                    <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {b.badgeText}
                    </span>
                  )}
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">{b.title || "Untitled Slide"}</h3>
                  {b.description && <p className="text-xs text-slate-500 dark:text-slate-300 line-clamp-2 leading-relaxed">{b.description}</p>}

                  <div className="pt-2 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 truncate">
                      <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{b.targetUrl || "/products"}</span>
                    </span>
                    <span className="shrink-0 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      Button: "{b.buttonText || "Shop Now"}"
                    </span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(b)}
                    className="font-bold text-xs gap-1.5 dark:border-slate-700 dark:text-white"
                  >
                    <Edit className="h-3.5 w-3.5 text-sky-500" /> Edit Slide
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(b.id)}
                    className="font-bold text-xs gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create / Edit Slide Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Film className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <span>{editingBanner ? "Edit Hero Slide" : "Add New Hero Video / Banner Slide"}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Media Type Selection */}
                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1.5">
                    1. Select Slide Media Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, mediaType: "IMAGE" })}
                      className={`p-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        form.mediaType === "IMAGE"
                          ? "border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <ImageIcon className="h-4 w-4" /> Image / Banner / GIF
                    </button>

                    <button
                      type="button"
                      onClick={() => setForm({ ...form, mediaType: "VIDEO" })}
                      className={`p-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        form.mediaType === "VIDEO"
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <Video className="h-4 w-4" /> MP4 / WebM Video
                    </button>
                  </div>
                </div>

                {/* Media File Upload & URL */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
                    2. Upload {form.mediaType === "VIDEO" ? "Video File (MP4 / WebM)" : "Banner Image File"}
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={form.mediaUrl}
                      onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                      placeholder={form.mediaType === "VIDEO" ? "Paste MP4 Video URL or click Upload" : "Paste Image URL or click Upload"}
                      className="flex-1 p-2.5 border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />

                    <label className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shrink-0">
                      <Upload className="h-4 w-4" />
                      <span>{uploading ? "Uploading..." : "Upload File"}</span>
                      <input
                        type="file"
                        accept={form.mediaType === "VIDEO" ? "video/mp4,video/webm,video/*" : "image/*"}
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Live Media Preview */}
                  {form.mediaUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border dark:border-slate-700 aspect-[16/7] bg-slate-950 flex items-center justify-center">
                      {form.mediaType === "VIDEO" ? (
                        <video src={form.mediaUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                      ) : (
                        <img src={form.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                </div>

                {/* Video Title & Description */}
                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                    3. Video / Banner Title (वीडियो का नाम)
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Samsung Galaxy S24 Ultra - Mega Fest Deal"
                    className="w-full p-2.5 border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                    4. Video / Banner Description (वीडियो विवरण)
                  </label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. Get up to ₹15,000 Instant Cashback, Free Galaxy Buds & 24-Hour Express Delivery!"
                    className="w-full p-2.5 border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Product Target Link URL */}
                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <LinkIcon className="h-3.5 w-3.5 text-sky-500" />
                    <span>5. Product Page Target Link URL (क्लिक करने पर खुलने वाला पेज) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.targetUrl}
                    onChange={(e) => setForm({ ...form, targetUrl: e.target.value })}
                    placeholder="e.g. /products/samsung-galaxy-s24-ultra or full link"
                    className="w-full p-2.5 border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Button Text & Badge Tag */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Action Button Text</label>
                    <input
                      type="text"
                      value={form.buttonText}
                      onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                      placeholder="e.g. Shop Now, Explore Deal"
                      className="w-full p-2.5 border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={form.badgeText}
                      onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                      placeholder="e.g. HOT DEAL, NEW LAUNCH"
                      className="w-full p-2.5 border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Slide Display Timing per banner */}
                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                    6. Slide Display Timing (स्लाइड टाइमिंग सेकेंड में)
                  </label>
                  <select
                    value={form.durationSeconds}
                    onChange={(e) => setForm({ ...form, durationSeconds: e.target.value })}
                    className="w-full p-2.5 border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="2">⚡ 2 Seconds (Fast Transition)</option>
                    <option value="3">⏱️ 3 Seconds (Recommended Standard)</option>
                    <option value="4">⌛ 4 Seconds</option>
                    <option value="5">🎬 5 Seconds (Ideal for Videos)</option>
                    <option value="8">📺 8 Seconds (Long Video)</option>
                    <option value="10">🏆 10 Seconds (Extended)</option>
                  </select>
                </div>

                {/* Slide Order & Active Switch */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Slide Order Index</label>
                    <input
                      type="number"
                      required
                      value={form.orderIndex}
                      onChange={(e) => setForm({ ...form, orderIndex: e.target.value })}
                      className="w-full p-2.5 border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Slide Status</label>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, active: !form.active })}
                      className={`w-full p-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                        form.active
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{form.active ? "ACTIVE ON HOMEPAGE" : "DRAFT (HIDDEN)"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 justify-end border-t border-slate-200 dark:border-slate-800">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="dark:border-slate-700 dark:text-slate-300">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold">
                    Save Hero Slide
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
