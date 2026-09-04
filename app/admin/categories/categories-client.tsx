"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, Tag, Upload, Image as ImageIcon, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  icon?: string | null;
  description?: string | null;
  _count?: { products?: number };
}

// Ceramic Category Image Presets for Quick Selection
const PRESET_IMAGES = [
  {
    name: "Tiles",
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Sanitary Ware",
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Bathroom Fittings",
    url: "https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Granite & Marble",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Plumbing & Hardware",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Paints",
    url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Tools",
    url: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Kitchen Sinks",
    url: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&auto=format&fit=crop&q=80",
  },
];

export default function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    image: "",
    icon: "",
    description: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/categories");
      const d = await r.json();
      setCategories(d?.categories ?? []);
    } catch (e) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const open = (c: Category | null) => {
    setEditing(c);
    setForm({
      name: c?.name ?? "",
      slug: c?.slug ?? "",
      image: c?.image ?? "",
      icon: c?.icon ?? "",
      description: c?.description ?? "",
    });
    setShowModal(true);
  };

  // Handle local file upload to Cloudinary/disk via /api/admin/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image file size should be less than 8MB");
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading("Uploading category image...");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Upload failed");
      }

      setForm((prev) => ({ ...prev, image: data.url }));
      toast.success("Category image uploaded!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image", { id: toastId });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      image: form.image.trim() || null,
      icon: form.icon.trim() || null,
      description: form.description.trim() || null,
    };

    try {
      const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || "Failed to save category");
      }

      toast.success(editing ? "Category updated successfully!" : "Category created successfully!");
      setShowModal(false);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"? This action cannot be undone.`)) return;
    try {
      const r = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(data?.error || "Failed to delete category");
      }
      toast.success("Category deleted");
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#062524] p-5 sm:p-6 rounded-2xl border border-[#0d4a47] shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Tag className="w-7 h-7 text-[#c59b27]" />
            <span>Store Categories & Home Page Previews</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
            Add and manage category images that appear on the website home page and store catalog
          </p>
        </div>
        <button
          onClick={() => open(null)}
          className="inline-flex items-center justify-center gap-2 bg-[#c59b27] hover:bg-[#b38820] text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg hover:shadow-[#c59b27]/30 transition active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-400 font-medium flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#c59b27]" /> Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-[#062524] rounded-2xl border border-[#0d4a47] p-8">
            <Tag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Categories Found</h3>
            <p className="text-xs text-slate-400 mb-4">Create your first category with an attractive preview image.</p>
            <button
              onClick={() => open(null)}
              className="inline-flex items-center gap-2 bg-[#c59b27] text-slate-950 font-bold px-4 py-2 rounded-xl text-sm"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>
        ) : (
          categories.map((c) => (
            <div
              key={c.id}
              className="group bg-[#021817] rounded-2xl border border-[#0d4a47] hover:border-[#c59b27] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Category Image Banner Preview */}
              <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#062524] to-[#021817] text-slate-400 p-4 text-center">
                    <ImageIcon className="w-8 h-8 text-[#c59b27]/60 mb-1.5" />
                    <span className="text-[11px] font-semibold text-slate-400">No Image Set</span>
                    <span className="text-[10px] text-[#c59b27] mt-0.5 font-medium">Click edit to add photo</span>
                  </div>
                )}

                {/* Products Badge */}
                <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-[#c59b27] text-xs font-black px-2.5 py-1 rounded-lg border border-[#c59b27]/30 shadow">
                  {c._count?.products ?? 0} Products
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow">
                  <button
                    onClick={() => open(c)}
                    className="p-1.5 rounded-lg text-[#c59b27] hover:bg-[#c59b27]/20 transition"
                    title="Edit Category"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => remove(c.id, c.name)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-white group-hover:text-[#c59b27] transition">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {c.description || "No description set"}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#0d4a47]/60 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-500">/{c.slug}</span>
                  <button
                    onClick={() => open(c)}
                    className="text-[#c59b27] font-bold hover:underline"
                  >
                    Change Image →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#021817] rounded-3xl w-full max-w-xl border-2 border-[#c59b27]/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#0d4a47] bg-[#062524]">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#c59b27]" />
                <h2 className="text-lg font-black text-white">
                  {editing ? `Edit Category: ${editing.name}` : "Create New Category"}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Category Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Designer Wall Tiles"
                  className="w-full bg-[#062524] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] transition"
                />
              </div>

              {/* Slug (URL key) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  URL Slug (Optional)
                </label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. designer-wall-tiles (auto-generated if empty)"
                  className="w-full bg-[#062524] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] transition font-mono text-xs"
                />
              </div>

              {/* Category Image Upload & URL Section */}
              <div className="space-y-2.5 pt-2 border-t border-[#0d4a47]">
                <label className="block text-xs font-bold text-[#c59b27] uppercase tracking-wider flex items-center justify-between">
                  <span>Category Preview Image (Home Page Display)</span>
                  {form.image && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="text-red-400 hover:text-red-300 text-[11px] font-bold"
                    >
                      Clear Image
                    </button>
                  )}
                </label>

                {/* Live Image Preview */}
                {form.image ? (
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border-2 border-[#c59b27] bg-slate-950 group shadow-inner">
                    <img
                      src={form.image}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#c59b27] text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold shadow hover:bg-[#b38820]"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-700 hover:border-[#c59b27] rounded-2xl p-6 text-center bg-[#062524]/60 transition-colors">
                    <ImageIcon className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-300 font-bold mb-1">
                      Upload Category Photo or Paste Web Image URL
                    </p>
                    <p className="text-[11px] text-slate-500 mb-3">
                      High resolution ceramic banner for home page and category navigation
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="inline-flex items-center gap-2 bg-[#0d4a47] hover:bg-[#125c59] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#c59b27]" /> Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-[#c59b27]" /> Browse File from Device
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                {/* Direct Image URL input */}
                <div className="pt-1">
                  <div className="relative">
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="Or paste Direct Image URL (https://...)"
                      className="w-full bg-[#062524] border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27] transition pr-24"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#0d4a47] hover:bg-[#125c59] text-[#c59b27] px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                    >
                      Upload
                    </button>
                  </div>
                </div>

                {/* Quick Presets Selector */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#c59b27]" /> Quick 1-Click Ceramic Presets:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, image: preset.url }))}
                        className={`flex items-center gap-2 p-1.5 rounded-xl border text-left text-xs transition ${
                          form.image === preset.url
                            ? "bg-[#062524] border-[#c59b27] text-[#c59b27] font-bold"
                            : "bg-[#021817] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-6 h-6 rounded-lg object-cover shrink-0"
                        />
                        <span className="truncate text-[11px]">{preset.name}</span>
                        {form.image === preset.url && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#c59b27] ml-auto shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2 border-t border-[#0d4a47]">
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Description / Tagline
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Premium Tiles, Sanitary Ware, Bathroom Fittings & More"
                  className="w-full bg-[#062524] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27] transition resize-none"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#0d4a47]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-[#c59b27] hover:bg-[#b38820] active:scale-95 text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editing ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
