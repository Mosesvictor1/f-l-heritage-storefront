import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, X, Upload, Loader2 } from "lucide-react";
import { AdminLayout, useAdminGuard } from "@/components/AdminLayout";
import { apiGet, apiPost, uploadToCloudinary, formatNaira } from "@/lib/api";
import type { Product } from "@/components/ProductCard";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const ready = useAdminGuard();
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const r = await apiGet<Product[] | { products?: Product[]; items?: Product[] }>("products", { limit: 500 });
      const d = r.data as any;
      return (Array.isArray(d) ? d : d?.items || d?.products || []) as Product[];
    },
    enabled: ready,
  });

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const r = await apiPost("products", {}, "DELETE", id);
    if (r.success) { toast.success("Deleted"); refetch(); } else toast.error(r.message || "Failed");
  };

  if (!ready) return null;

  return (
    <AdminLayout title="Products">
      <div className="flex justify-end mb-4">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Image</th><th className="p-3">Name</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Status</th><th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading…</td></tr>}
              {data?.map((p) => (
                <tr key={p.id}>
                  <td className="p-3">
                    <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden">
                      {p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                    </div>
                  </td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{formatNaira(p.price)}</td>
                  <td className="p-3">
                    <span className={Number(p.stock ?? 0) <= 5 ? "text-destructive font-semibold" : ""}>{p.stock ?? 0}</span>
                  </td>
                  <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted">{p.status || "active"}</span></td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-1.5 rounded hover:bg-muted"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => del(p.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {data && data.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No products.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <ProductForm product={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); refetch(); }} />}
    </AdminLayout>
  );
}

const STYLE_PRESETS = ["Adisa", "Ishola", "Akanni", "Otunba", "Abeti Aja"];

function parseStyles(input: unknown): string[] {
  if (Array.isArray(input)) return input.map((s) => String(s).trim()).filter(Boolean);
  if (typeof input === "string" && input.trim())
    return input.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function ProductForm({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: () => void }) {
  const initialStyles = parseStyles((product as any)?.styles ?? product?.style);
  const [form, setForm] = useState({
    name: product?.name || "",
    price: String(product?.price ?? ""),
    salePrice: String(product?.salePrice ?? ""),
    category: product?.category || "",
    description: product?.description || "",
    shortDescription: product?.shortDescription || "",
    stock: String(product?.stock ?? 0),
    status: product?.status || "active",
    featured: !!product?.featured,
  });
  const [styles, setStyles] = useState<string[]>(initialStyles);
  const [customStyle, setCustomStyle] = useState("");
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggleStyle = (name: string) => {
    setStyles((prev) => (prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]));
  };
  const addCustomStyle = () => {
    const v = customStyle.trim();
    if (!v) return;
    if (!styles.includes(v)) setStyles((prev) => [...prev, v]);
    setCustomStyle("");
  };

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));
      setImages((prev) => [...prev, ...urls]);
    } catch (err) { toast.error((err as Error).message); }
    finally { setUploading(false); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : 0,
        stock: Number(form.stock),
        styles,
        style: styles[0] || "",
        images,
      };
      const r = product
        ? await apiPost("products", payload, "PUT", product.id)
        : await apiPost("products", payload, "POST");
      if (!r.success) throw new Error(r.message || "Failed");
      toast.success(product ? "Updated" : "Created");
      onSaved();
    } catch (err) { toast.error((err as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4 overflow-y-auto">
      <form onSubmit={submit} className="w-full max-w-2xl bg-card rounded-3xl p-6 my-8 relative">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted"><X className="h-5 w-5" /></button>
        <h2 className="font-display text-2xl font-bold">{product ? "Edit product" : "Add product"}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Fld label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Fld label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <Fld label="Price (₦)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} required />
          <Fld label="Sale Price (₦)" type="number" value={form.salePrice} onChange={(v) => setForm({ ...form, salePrice: v })} />
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Styles (select one or more)</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from(new Set([...STYLE_PRESETS, ...styles])).map((s) => {
                const active = styles.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleStyle(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:bg-muted"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomStyle(); } }}
                placeholder="Add custom style"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <button type="button" onClick={addCustomStyle} className="rounded-lg bg-secondary text-secondary-foreground px-3 py-2 text-sm font-semibold">
                Add
              </button>
            </div>
            {styles.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">Selected: {styles.join(", ")}</p>
            )}
          </div>
          <Fld label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Short description</label>
            <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <label className="flex items-center gap-2 mt-6 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
          </label>
        </div>

        <div className="mt-6">
          <label className="text-sm font-medium">Images</label>
          <div className="mt-2 flex flex-wrap gap-3">
            {images.map((url, i) => (
              <div key={i} className="relative h-24 w-24 rounded-xl overflow-hidden bg-muted">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setImages((im) => im.filter((_, j) => j !== i))} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white grid place-items-center text-xs">×</button>
              </div>
            ))}
            <label className="h-24 w-24 rounded-xl border-2 border-dashed border-border grid place-items-center cursor-pointer hover:bg-muted">
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
              <input type="file" multiple accept="image/*" className="hidden" onChange={onFiles} disabled={uploading} />
            </label>
          </div>
        </div>

        <button disabled={busy || uploading} className="mt-6 w-full rounded-full bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-50">
          {busy ? "Saving…" : "Save product"}
        </button>
      </form>
    </div>
  );
}

function Fld({ label, value, onChange, ...rest }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
    </div>
  );
}