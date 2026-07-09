import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { StoreLayout } from "@/components/StoreLayout";
import { useCart } from "@/lib/cart";
import { apiPost, formatNaira } from "@/lib/api";
import { PaymentModal, type OrderResult } from "@/components/PaymentModal";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: "", phone: "", email: "", address: "", city: "", state: "", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [customerNameSubmitted, setCustomerNameSubmitted] = useState("");

  const change = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("Your cart is empty");
    for (const k of ["customerName", "phone", "address", "city", "state"] as const) {
      if (!form[k]) return toast.error("Please fill all required fields");
    }
    setSubmitting(true);
    try {
      const r = await apiPost<OrderResult>("orders", {
        ...form,
        products: items.map((i) => ({ id: i.id, qty: i.qty })),
      });
      if (!r.success) throw new Error(r.message || "Could not place order");
      setCustomerNameSubmitted(form.customerName);
      setOrder(r.data as OrderResult);
      clear();
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setSubmitting(false); }
  };

  if (items.length === 0 && !order) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
          <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary text-primary-foreground px-8 py-3 font-semibold">Shop now</Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <h1 className="font-display text-4xl font-bold">Checkout</h1>
        <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <form onSubmit={submit} className="space-y-4">
            <Field label="Full name*" value={form.customerName} onChange={change("customerName")} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone*" value={form.phone} onChange={change("phone")} />
              <Field label="Email" type="email" value={form.email} onChange={change("email")} />
            </div>
            <Field label="Address*" value={form.address} onChange={change("address")} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City*" value={form.city} onChange={change("city")} />
              <Field label="State*" value={form.state} onChange={change("state")} />
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <textarea value={form.notes} onChange={change("notes")} rows={3} className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
            </div>
            <button disabled={submitting} className="w-full rounded-full bg-primary text-primary-foreground py-3.5 font-semibold hover:opacity-90 disabled:opacity-50">
              {submitting ? "Placing order…" : "Place Order"}
            </button>
          </form>

          <aside className="rounded-2xl border border-border p-6 bg-card h-fit">
            <h2 className="font-display text-xl font-bold">Your order</h2>
            <ul className="mt-4 space-y-3">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between text-sm">
                  <span className="min-w-0 truncate">{i.name} × {i.qty}</span>
                  <span className="font-medium shrink-0 ml-2">{formatNaira(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">{formatNaira(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Delivery fee added on confirmation.</p>
          </aside>
        </div>
      </div>

      {order && (
        <PaymentModal
          order={order}
          customerName={customerNameSubmitted}
          onClose={() => { setOrder(null); navigate({ to: "/" }); }}
        />
      )}
    </StoreLayout>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input {...rest} className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
    </div>
  );
}