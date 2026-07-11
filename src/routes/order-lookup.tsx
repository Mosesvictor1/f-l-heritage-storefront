import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { StoreLayout } from "@/components/StoreLayout";
import { apiGet, formatNaira } from "@/lib/api";

export const Route = createFileRoute("/order-lookup")({
  component: OrderLookup,
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
  subtotal?: number;
  deliveryFee?: number;
  paymentStatus?: string;
  orderStatus?: string;
  products?: Array<{ id: string; name?: string; qty: number; price?: number }>;
  receiptUrl?: string;
}

function OrderLookup() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setOrder(null);
    try {
      const r = await apiGet<any>("orders", { id: orderId });
      if (!r.success || !r.data) throw new Error(r.message || "Order not found");
      
      let o: Order | null = null;
      const d = r.data;
      if (d.items && Array.isArray(d.items)) {
        o = d.items[0] as Order;
      } else if (Array.isArray(d)) {
        o = d[0] as Order;
      } else {
        o = d as Order;
      }

      if (!o || !o.orderId) throw new Error("Order not found");

      if ((o.email || "").toLowerCase().trim() !== email.toLowerCase().trim()) {
        throw new Error("Email does not match this order.");
      }
      setOrder(o);
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setBusy(false); }
  };

  return (
    <StoreLayout>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
        <h1 className="font-display text-4xl font-bold text-center">Track Your Order</h1>
        <p className="mt-2 text-center text-muted-foreground">Enter your order ID and email.</p>
        <form onSubmit={submit} className="mt-8 space-y-3">
          <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order ID" className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm" required />
          <button disabled={busy} className="w-full rounded-full bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-50">
            {busy ? "Looking up…" : "Track Order"}
          </button>
        </form>

        {order && (
          <div className="mt-10 rounded-2xl border border-border p-6 bg-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">Order</p>
                <h2 className="font-display text-xl font-bold">{order.orderId}</h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold text-primary">{formatNaira(order.total)}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="font-medium">{order.paymentStatus || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Order status</span><span className="font-medium">{order.orderStatus || "—"}</span></div>
            </div>
            {order.products && (
              <ul className="mt-4 pt-4 border-t border-border space-y-1 text-sm">
                {order.products.map((p, i) => (
                  <li key={i} className="flex justify-between"><span>{p.name || p.id} × {p.qty}</span></li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}