import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { X, MessageCircle } from "lucide-react";
import { AdminLayout, useAdminGuard } from "@/components/AdminLayout";
import { apiGet, apiPost, formatNaira } from "@/lib/api";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

interface Order {
  orderId: string;
  customerName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  total: number;
  paymentStatus?: string;
  orderStatus?: string;
  createdAt?: string;
  receiptUrl?: string;
  notes?: string;
  products?: Array<{ id: string; name?: string; qty: number; price?: number }>;
}

const PAY = ["Awaiting Payment", "Receipt Uploaded", "Paid", "Failed"];
const STATUS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function getWhatsappLink(phone: string | number | undefined): string {
  if (!phone) return "";
  let clean = String(phone).replace(/\D/g, "");
  if (clean.startsWith("0")) {
    clean = "234" + clean.slice(1);
  } else if (clean.length === 10 && (clean.startsWith("7") || clean.startsWith("8") || clean.startsWith("9"))) {
    clean = "234" + clean;
  }
  return `https://wa.me/${clean}`;
}

function AdminOrders() {
  const ready = useAdminGuard();
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "orders", orderStatus, paymentStatus, q],
    queryFn: async () => {
      const r = await apiGet<Order[] | { orders?: Order[]; items?: Order[] }>("orders", {
        orderStatus: orderStatus || undefined,
        paymentStatus: paymentStatus || undefined,
        q: q || undefined,
        limit: 200,
      });
      const d = r.data as any;
      return (Array.isArray(d) ? d : d?.items || d?.orders || []) as Order[];
    },
    enabled: ready,
  });

  const changeStatus = async (orderId: string, status: string) => {
    const r = await apiPost("orders", { orderId, status }, "PATCH", "status");
    if (r.success) { toast.success("Status updated — customer emailed."); refetch(); if (selected?.orderId === orderId) setSelected({ ...selected, orderStatus: status }); }
    else toast.error(r.message || "Failed");
  };
  const changePayment = async (orderId: string, paymentStatus: string) => {
    const r = await apiPost("orders", { orderId, paymentStatus }, "PATCH", "payment");
    if (r.success) { toast.success("Payment status updated — customer emailed."); refetch(); if (selected?.orderId === orderId) setSelected({ ...selected, paymentStatus }); }
    else toast.error(r.message || "Failed");
  };

  if (!ready) return null;

  return (
    <AdminLayout title="Orders">
      <div className="flex flex-wrap gap-3 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="rounded-lg border border-border bg-card px-3 py-2 text-sm" />
        <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          <option value="">All order statuses</option>
          {STATUS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          <option value="">All payment statuses</option>
          {PAY.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Payment</th><th className="p-3">Status</th><th className="p-3">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading…</td></tr>}
              {data?.map((o) => (
                <tr key={o.orderId} onClick={() => setSelected(o)} className="cursor-pointer hover:bg-muted/40">
                  <td className="p-3 font-medium">{o.orderId}</td>
                  <td className="p-3">{o.customerName}</td>
                  <td className="p-3">{formatNaira(o.total)}</td>
                  <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted">{o.paymentStatus || "—"}</span></td>
                  <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted">{o.orderStatus || "—"}</span></td>
                  <td className="p-3 text-muted-foreground">{o.createdAt || "—"}</td>
                </tr>
              ))}
              {data && data.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No orders.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 grid justify-end" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg h-full bg-card overflow-y-auto p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Order</p>
                <h2 className="font-display text-2xl font-bold">{selected.orderId}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-muted"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p><b>{selected.customerName}</b></p>
                {selected.phone && (
                  <a
                    href={getWhatsappLink(selected.phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs font-semibold shadow-sm transition"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                )}
              </div>
              <p className="text-muted-foreground">{selected.email} • {selected.phone}</p>
              <p className="text-muted-foreground">{selected.address}, {selected.city}, {selected.state}</p>
              {selected.notes && <p className="italic text-muted-foreground">Note: {selected.notes}</p>}
            </div>
            <div className="mt-6">
              <h3 className="font-semibold">Items</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {selected.products?.map((p, i) => (
                  <li key={i} className="flex justify-between"><span>{p.name || p.id} × {p.qty}</span><span>{formatNaira((p.price || 0) * p.qty)}</span></li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-border flex justify-between font-bold"><span>Total</span><span>{formatNaira(selected.total)}</span></div>
            </div>
            {selected.receiptUrl && (
              <div className="mt-6">
                <h3 className="font-semibold">Receipt</h3>
                <a href={selected.receiptUrl} target="_blank" rel="noreferrer">
                  <img src={selected.receiptUrl} alt="Receipt" className="mt-2 max-w-full rounded-xl border border-border" />
                </a>
              </div>
            )}
            <div className="mt-6 space-y-3">
              <div>
                <label className="text-sm font-medium">Payment status</label>
                <select value={selected.paymentStatus || ""} onChange={(e) => changePayment(selected.orderId, e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <option value="">—</option>
                  {PAY.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Order status</label>
                <select value={selected.orderStatus || ""} onChange={(e) => changeStatus(selected.orderId, e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <option value="">—</option>
                  {STATUS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}