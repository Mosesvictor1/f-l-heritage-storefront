import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { AdminLayout, useAdminGuard } from "@/components/AdminLayout";
import { apiGet, apiPost, formatNaira } from "@/lib/api";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalOrders?: number;
  totalSpent?: number;
  createdAt?: string;
}

function AdminCustomers() {
  const ready = useAdminGuard();
  const [q, setQ] = useState("");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "customers", q],
    queryFn: async () => {
      const r = await apiGet<Customer[] | { customers?: Customer[] }>("customers", { q: q || undefined, limit: 200 });
      const d = r.data as any;
      return (Array.isArray(d) ? d : d?.customers || []) as Customer[];
    },
    enabled: ready,
  });

  const del = async (id: string) => {
    if (!confirm("Delete this customer?")) return;
    const r = await apiPost("customers", {}, "DELETE", id);
    if (r.success) { toast.success("Deleted"); refetch(); } else toast.error(r.message || "Failed");
  };

  if (!ready) return null;
  return (
    <AdminLayout title="Customers">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="mb-4 rounded-lg border border-border bg-card px-3 py-2 text-sm" />
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Orders</th><th className="p-3">Spent</th><th className="p-3">Joined</th><th className="p-3"></th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Loading…</td></tr>}
              {data?.map((c) => (
                <tr key={c.id}>
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3">{c.email || "—"}</td>
                  <td className="p-3">{c.phone || "—"}</td>
                  <td className="p-3">{c.totalOrders ?? 0}</td>
                  <td className="p-3">{formatNaira(c.totalSpent ?? 0)}</td>
                  <td className="p-3 text-muted-foreground">{c.createdAt || "—"}</td>
                  <td className="p-3"><button onClick={() => del(c.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button></td>
                </tr>
              ))}
              {data && data.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No customers.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}