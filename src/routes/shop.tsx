import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { StoreLayout } from "@/components/StoreLayout";
import { ProductCard, type Product } from "@/components/ProductCard";
import { apiGet } from "@/lib/api";
import { withDemoFallback } from "@/lib/demo-products";

type ShopSearch = { style?: string; category?: string; q?: string; sort?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    style: typeof s.style === "string" ? s.style : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
    sort: typeof s.sort === "string" ? s.sort : undefined,
  }),
  component: ShopPage,
});

const STYLES = ["Adisa", "Ishola", "Akanni", "Otunba"];
const SORTS = [
  { v: "newest", label: "Newest" },
  { v: "price_asc", label: "Price: Low to High" },
  { v: "price_desc", label: "Price: High to Low" },
  { v: "name", label: "Name A–Z" },
];

function ShopPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q || "");

  const { data, isLoading } = useQuery({
    queryKey: ["products", "list", search],
    queryFn: async () => {
      const r = await apiGet<Product[] | { products?: Product[] }>("products", {
        style: search.style,
        category: search.category,
        q: search.q,
        sort: search.sort,
      });
      const d = r.data as any;
      return (Array.isArray(d) ? d : d?.products || []) as Product[];
    },
  });

  const setSearch = (patch: Partial<ShopSearch>) => {
    navigate({ search: (prev: ShopSearch) => ({ ...prev, ...patch }) });
  };

  return (
    <StoreLayout>
      <section className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <h1 className="font-display text-4xl sm:text-5xl font-bold">Shop the Collection</h1>
          <p className="mt-2 text-muted-foreground">Handcrafted Yoruba caps, made to last.</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <form
              onSubmit={(e) => { e.preventDefault(); setSearch({ q: q || undefined }); }}
              className="relative flex-1 min-w-[220px] max-w-md"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search Fìlá…"
                className="w-full rounded-full bg-card border border-border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </form>
            <select
              value={search.sort || ""}
              onChange={(e) => setSearch({ sort: e.target.value || undefined })}
              className="rounded-full bg-card border border-border px-4 py-2.5 text-sm"
            >
              <option value="">Sort by</option>
              {SORTS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSearch({ style: undefined })}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${!search.style ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`}
            >
              All Styles
            </button>
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setSearch({ style: s })}
                className={`px-4 py-1.5 rounded-full text-sm border transition ${search.style === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        {isLoading ? (
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {data.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">No products found.</p>
        )}
      </section>
    </StoreLayout>
  );
}