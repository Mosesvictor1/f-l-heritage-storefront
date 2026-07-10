import { Link } from "@tanstack/react-router";
import { ShoppingCart, Plus, Minus, Eye } from "lucide-react";
import { formatNaira } from "@/lib/api";
import { useCart } from "@/lib/cart";

export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  images?: string[];
  category?: string;
  style?: string;
  styles?: string[] | string;
  description?: string;
  shortDescription?: string;
  stock?: number;
  status?: string;
  featured?: boolean;
}

export function ProductCard({ p }: { p: Product }) {
  const img = p.images?.[0];
  const hasSale = p.salePrice && Number(p.salePrice) > 0 && Number(p.salePrice) < Number(p.price);
  const displayPrice = hasSale ? Number(p.salePrice) : Number(p.price);
  const { items, add, setQty, remove } = useCart();
  const inCart = items.find((i) => i.id === p.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({ id: p.id, name: p.name, price: displayPrice, image: img, stock: p.stock }, 1);
  };
  const inc = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) setQty(p.id, inCart.qty + 1);
  };
  const dec = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCart) return;
    if (inCart.qty <= 1) remove(p.id);
    else setQty(p.id, inCart.qty - 1);
  };

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link
        to="/products/$id"
        params={{ id: p.id }}
        className="relative aspect-square bg-muted overflow-hidden block"
      >
        {img ? (
          <img src={img} alt={p.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="h-full w-full grid place-items-center text-muted-foreground text-sm">No image</div>
        )}

        {/* Floating cart control top-right */}
        <div className="absolute top-2 right-2">
          {inCart ? (
            <div className="flex items-center gap-1 rounded-full bg-background/95 backdrop-blur shadow-md border border-border/60 p-1">
              <button
                onClick={dec}
                aria-label="Decrease quantity"
                className="h-7 w-7 grid place-items-center rounded-full hover:bg-muted transition"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[1.25rem] text-center text-sm font-semibold">{inCart.qty}</span>
              <button
                onClick={inc}
                aria-label="Increase quantity"
                className="h-7 w-7 grid place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              aria-label={`Add ${p.name} to cart`}
              className="h-9 w-9 grid place-items-center rounded-full bg-primary text-primary-foreground shadow-md hover:opacity-90 hover:scale-105 transition"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-2">
        <Link to="/products/$id" params={{ id: p.id }} className="block">
          <h3 className="font-display font-semibold text-lg truncate hover:text-primary transition">{p.name}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            {hasSale ? (
              <>
                <span className="text-primary font-bold">{formatNaira(p.salePrice)}</span>
                <span className="text-xs line-through text-muted-foreground">{formatNaira(p.price)}</span>
              </>
            ) : (
              <span className="text-primary font-bold">{formatNaira(p.price)}</span>
            )}
          </div>
        </Link>
        <Link
          to="/products/$id"
          params={{ id: p.id }}
          className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary py-2 text-xs font-semibold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition"
        >
          <Eye className="h-3.5 w-3.5" /> View Product
        </Link>
      </div>
    </div>
  );
}
