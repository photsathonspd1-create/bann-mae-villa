"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type Campaign = {
  id: string;
  title: string;
  slug: string;
  content: string;
  bannerImage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const emptyCampaign: Omit<Campaign, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  slug: "",
  content: "",
  bannerImage: "",
  isActive: true,
};

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Campaign | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bannerImageEmpty = !form?.bannerImage?.trim();

  function fetchCampaigns() {
    setLoading(true);
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => setCampaigns(Array.isArray(data) ? data : []))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("watermark", "false");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url && form) {
        setForm({ ...form, bannerImage: data.url });
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  function startAdd() {
    setForm({
      ...emptyCampaign,
      bannerImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80&auto=format&fit=crop",
    } as Campaign);
    setEditingId("new");
  }

  function startEdit(campaign: Campaign) {
    setForm({ ...campaign });
    setEditingId(campaign.id);
  }

  async function saveCampaign() {
    if (!form) return;
    if (!form.title?.trim() || !form.slug?.trim() || !form.content?.trim() || !form.bannerImage?.trim()) {
      setSaveError("All fields are required. Please fill in all fields and upload a banner image.");
      return;
    }
    setSaveError(null);
    if (editingId === "new") {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          slug: form.slug.trim(),
          content: form.content.trim(),
          bannerImage: form.bannerImage.trim(),
          isActive: form.isActive,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setForm(null);
        setEditingId(null);
        fetchCampaigns();
      } else {
        setSaveError(data.error || "Failed to save.");
      }
    } else {
      const res = await fetch(`/api/campaigns/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          slug: form.slug.trim(),
          content: form.content.trim(),
          bannerImage: form.bannerImage.trim(),
          isActive: form.isActive,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setForm(null);
        setEditingId(null);
        fetchCampaigns();
      } else {
        setSaveError(data.error || "Failed to save.");
      }
    }
  }

  async function deleteCampaign(id: string) {
    if (!confirm("Delete this campaign? This action cannot be undone.")) return;
    const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEditingId(null);
      setForm(null);
      fetchCampaigns();
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    const res = await fetch(`/api/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentStatus }),
    });
    if (res.ok) {
      fetchCampaigns();
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Campaigns</h1>
        <button
          type="button"
          onClick={startAdd}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" />
          Add Campaign
        </button>
      </div>
      <p className="mb-6 text-sm text-neutral-400">
        Manage promotional campaigns and special offers. Create beautiful landing pages that can be linked from hero slides.
      </p>

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : (
        <div className="space-y-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex flex-col gap-4 rounded-xl border border-neutral-700 bg-neutral-900/80 p-4 sm:flex-row sm:items-start"
            >
              <div className="relative h-32 w-full flex-shrink-0 overflow-hidden rounded-lg bg-neutral-800 sm:h-24 sm:w-40">
                <Image
                  src={campaign.bannerImage}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{campaign.title}</p>
                    <p className="text-sm text-amber-400/80">/{campaign.slug}</p>
                    <p className="mt-1 text-sm text-neutral-400 line-clamp-2">{campaign.content}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-neutral-500">
                      <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                      <span className={campaign.isActive ? "text-emerald-400" : "text-red-400"}>
                        {campaign.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleActive(campaign.id, campaign.isActive)}
                      className="rounded-lg border border-neutral-600 p-2 text-neutral-300 hover:bg-neutral-800"
                      title={campaign.isActive ? "Deactivate" : "Activate"}
                    >
                      {campaign.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(campaign)}
                      className="rounded-lg border border-neutral-600 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCampaign(campaign.id)}
                      className="rounded-lg border border-red-500/50 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {campaigns.length === 0 && !form && (
            <p className="rounded-xl border border-dashed border-neutral-700 py-12 text-center text-neutral-500">
              No campaigns yet. Click "Add Campaign" to create one.
            </p>
          )}
        </div>
      )}

      {/* Edit / Add Modal */}
      {form && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setEditingId(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold text-white">
              {editingId === "new" ? "New Campaign" : "Edit Campaign"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-neutral-400">Title (required)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setForm({ ...form, title: newTitle, slug: editingId === "new" ? generateSlug(newTitle) : form.slug });
                    setSaveError(null);
                  }}
                  className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-white"
                  placeholder="Summer Promotion 2024"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm text-neutral-400">Slug (required, unique)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") });
                    setSaveError(null);
                  }}
                  className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-white"
                  placeholder="summer-promotion-2024"
                />
                <p className="mt-1 text-xs text-neutral-500">Used in URL: /campaign/{form.slug || "slug"}</p>
              </div>

              <div>
                <label className="mb-1 block text-sm text-neutral-400">Content (required)</label>
                <textarea
                  value={form.content}
                  onChange={(e) => {
                    setForm({ ...form, content: e.target.value });
                    setSaveError(null);
                  }}
                  rows={6}
                  className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-white"
                  placeholder="Describe your promotion, special offers, details, etc."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-neutral-400">Banner Image (required)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.bannerImage}
                    onChange={(e) => {
                      setForm({ ...form, bannerImage: e.target.value });
                      setSaveError(null);
                    }}
                    className={`flex-1 rounded-lg border bg-neutral-800 px-3 py-2 text-white ${
                      bannerImageEmpty ? "border-red-500/60" : "border-neutral-600"
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="rounded-lg bg-neutral-700 px-3 py-2 text-sm text-white hover:bg-neutral-600 disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
                {bannerImageEmpty && (
                  <p className="mt-1 text-sm text-red-400">Please add or upload a banner image to save.</p>
                )}
                {saveError && !bannerImageEmpty && (
                  <p className="mt-1 text-sm text-red-400">{saveError}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-neutral-600 bg-neutral-800 text-amber-400 focus:ring-amber-400"
                />
                <label htmlFor="isActive" className="text-sm text-neutral-300">
                  Campaign is active (visible to public)
                </label>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={saveCampaign}
                disabled={bannerImageEmpty || !form.title.trim() || !form.slug.trim() || !form.content.trim()}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setForm(null)}
                className="rounded-lg border border-neutral-600 px-4 py-2 text-sm text-neutral-400 hover:bg-neutral-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
