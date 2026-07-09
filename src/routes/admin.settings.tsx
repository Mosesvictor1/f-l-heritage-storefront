import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminLayout, useAdminGuard } from "@/components/AdminLayout";
import { apiGet, apiPost } from "@/lib/api";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

const FIELDS: Array<{ key: string; label: string; textarea?: boolean }> = [
  { key: "storeName", label: "Store name" },
  { key: "logoUrl", label: "Logo URL" },
  { key: "phone", label: "Phone" },
  { key: "whatsappNumber", label: "WhatsApp number" },
  { key: "email", label: "Email" },
  { key: "supportEmail", label: "Support email" },
  { key: "adminEmail", label: "Admin email" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "websiteUrl", label: "Website URL" },
  { key: "address", label: "Address", textarea: true },
  { key: "bankName", label: "Bank name" },
  { key: "accountName", label: "Account name" },
  { key: "accountNumber", label: "Account number" },
  { key: "heroTitle", label: "Hero title" },
  { key: "heroSubtitle", label: "Hero subtitle" },
  { key: "about", label: "About store", textarea: true },
];

function AdminSettings() {
  const ready = useAdminGuard();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => (await apiGet<Record<string, string>>("settings")).data || {},
    enabled: ready,
  });
  const [form, setForm] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) setForm({ ...data });
  }, [data]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await apiPost("settings", form, "PUT");
      if (!r.success) throw new Error(r.message || "Failed");
      toast.success("Settings saved");
      refetch();
    } catch (err) { toast.error((err as Error).message); }
    finally { setBusy(false); }
  };

  if (!ready) return null;
  return (
    <AdminLayout title="Settings">
      {isLoading ? <p className="text-muted-foreground">Loading…</p> : (
        <form onSubmit={save} className="max-w-3xl rounded-2xl bg-card border border-border p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key} className={f.textarea ? "sm:col-span-2" : ""}>
                <label className="text-sm font-medium">{f.label}</label>
                {f.textarea ? (
                  <textarea value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                ) : (
                  <input value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                )}
              </div>
            ))}
          </div>
          <button disabled={busy} className="mt-6 rounded-full bg-primary text-primary-foreground px-8 py-3 font-semibold disabled:opacity-50">
            {busy ? "Saving…" : "Save settings"}
          </button>
        </form>
      )}
    </AdminLayout>
  );
}