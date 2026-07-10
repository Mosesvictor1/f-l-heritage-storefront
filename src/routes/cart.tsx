import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { StoreLayout } from "@/components/StoreLayout";
import { useCart } from "@/lib/cart";
import { formatNaira } from "@/lib/api";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();

  return (
    <StoreLayout>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <h1 className="font-display text-4xl font-bold">Your Cart</h1>

        {items.length === 0 ? (
          <div className="mt-16 text-center">
            <ShoppingBag className="h-14 w-14 mx-auto text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
            <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary text-primary-foreground px-8 py-3 font-semibold">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {items.map((i) => (
                <div key={i.id} className="flex gap-4 rounded-2xl border border-border p-4 bg-card">
                  <div className="h-24 w-24 rounded-xl overflow-hidden bg-muted shrink-0">
                    {i.image && <img src={i.image} alt={i.name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className="font-display font-semibold truncate">{i.name}</h3>
                    <p className="text-primary font-bold">{formatNaira(i.price)}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button onClick={() => setQty(i.id, i.qty - 1)} className="p-2 hover:bg-muted rounded-l-full"><Minus className="h-3.5 w-3.5" /></button>
                        <span className="px-3 text-sm font-medium">{i.qty}</span>
                        <button onClick={() => setQty(i.id, i.qty + 1)} className="p-2 hover:bg-muted rounded-r-full"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                      <button onClick={() => remove(i.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-2xl border border-border p-6 bg-card h-fit sticky top-24">
              <h2 className="font-display text-xl font-bold">Order Summary</h2>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatNaira(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Delivery fee calculated at checkout.</p>
              <Link to="/checkout" className="mt-6 block text-center rounded-full bg-primary text-primary-foreground py-3 font-semibold hover:opacity-90">
                Proceed to Order
              </Link>
            </aside>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}