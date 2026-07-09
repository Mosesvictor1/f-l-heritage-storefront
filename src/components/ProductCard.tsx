import { Link } from "@tanstack/react-router";
import { formatNaira } from "@/lib/api";

export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  images?: string[];
  category?: string;
  style?: string;
  description?: string;
  shortDescription?: string;
  stock?: number;
  status?: string;
  featured?: boolean;
}

export function ProductCard({ p }: { p: Product }) {
  const img = p.images?.[0];
  const hasSale = p.salePrice && Number(p.salePrice) > 0 && Number(p.salePrice) < Number(p.price);
  return (
    <Link
      to="/products/$id"
      params={{ id: p.id }}
      className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-square bg-muted overflow-hidden">
        {img ? (
          <img src={img} alt={p.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="h-full w-full grid place-items-center text-muted-foreground text-sm">No image</div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1">
        {p.style && <span className="text-xs uppercase tracking-wider text-muted-foreground">{p.style}</span>}
        <h3 className="font-display font-semibold text-lg truncate">{p.name}</h3>
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
      </div>
    </Link>
  );
}