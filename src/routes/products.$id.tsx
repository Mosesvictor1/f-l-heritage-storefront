import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Star, Minus, Plus, ArrowLeft, ShoppingBag, ArrowRight, Ruler, X } from "lucide-react";
import { StoreLayout } from "@/components/StoreLayout";
import { apiGet, apiPost, formatNaira } from "@/lib/api";
import type { Product } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import { DEMO_PRODUCTS } from "@/lib/demo-products";

export const Route = createFileRoute("/products/$id")({
  component: ProductPage,
});

interface Review {
  id?: string;
  reviewId?: string;
  customerName: string;
  rating: number;
  review: string;
  status?: string;
  createdAt?: string;
}

function ProductPage() {
  const { id } = Route.useParams();
  const { add, items } = useCart();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showSizeChart, setShowSizeChart] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      try {
        const r = await apiGet<Product>("products", { id });
        if (r?.data) return r.data as Product;
      } catch {
        // fall through to demo fallback
      }
      const demo = DEMO_PRODUCTS.find((p) => p.id === id);
      return (demo ?? null) as Product | null;
    },
  });

  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const r = await apiGet<Review[] | { reviews?: Review[] } | { items?: Review[] }>("reviews", { productId: id, status: "approved" });
      const d = r.data as any;
      const list = (Array.isArray(d) ? d : d?.items || d?.reviews || []) as Review[];
      return list.filter((r) => (r.status || "approved") === "approved");
    },
  });

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 lg:grid-cols-2">
          <div className="aspect-square bg-muted rounded-3xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-6 w-1/3 bg-muted rounded animate-pulse" />
            <div className="h-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (!product) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-bold">Product not found</h1>
          <Link to="/shop" className="mt-6 inline-flex text-primary hover:underline">← Back to shop</Link>
        </div>
      </StoreLayout>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const hasSale = product.salePrice && Number(product.salePrice) > 0 && Number(product.salePrice) < Number(product.price);
  const displayPrice = hasSale ? Number(product.salePrice) : Number(product.price);
  const stock = Number(product.stock ?? 0);
  const inStock = stock > 0;
  const cartKeyParts = [product.id, selectedStyle, selectedSize].filter(Boolean);
  const cartLookupId = cartKeyParts.join("::");
  const inCart = items.find(
    (i) => i.id === cartLookupId || i.id === product.id || i.id.startsWith(`${product.id}::`),
  );

  // Styles available for THIS product — sourced from the API (array or comma-separated).
  // Falls back to the product's single `style` field if present.
  const rawStyles = (product as any).styles ?? product.style;
  const STYLE_OPTIONS: string[] = (
    Array.isArray(rawStyles)
      ? rawStyles
      : typeof rawStyles === "string" && rawStyles.trim()
        ? rawStyles.split(",")
        : []
  )
    .map((s: string) => String(s).trim())
    .filter(Boolean);

  // Sizes available for THIS product — sourced from the API (array or comma-separated).
  // Falls back to the standard Fìlá size run.
  const rawSizes = (product as any).sizes;
  const apiSizes: string[] = (
    Array.isArray(rawSizes)
      ? rawSizes
      : typeof rawSizes === "string" && rawSizes.trim()
        ? rawSizes.split(",")
        : []
  )
    .map((s: string) => String(s).trim())
    .filter(Boolean);
  const SIZE_OPTIONS: string[] =
    apiSizes.length > 0 ? apiSizes : ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const STYLE_PRICES: Record<string, number> = {
    "Adisa -Hard band": 10000,
    "Adisa - Hard band": 10000,
    "Adisa": 10000,
    "Ishola -Soft band": 10000,
    "Ishola - Soft band": 10000,
    "Ishola": 10000,
    "Akanni -No band": 10000,
    "Akanni - No band": 10000,
    "Akanni": 10000,
    "Otunba -Hand netted": 15000,
    "Otunba - Hand netted": 15000,
    "Otunba": 15000,
    "Abeti Aja -Signature": 15000,
    "Abeti Aja - Signature": 15000,
    "Abeti Aja": 15000,
  };
  const stylePriceFor = (name: string): number | undefined => {
    if (!name) return undefined;
    if (STYLE_PRICES[name] != null) return STYLE_PRICES[name];
    const key = Object.keys(STYLE_PRICES).find(
      (k) => k.toLowerCase() === name.toLowerCase(),
    );
    if (key) return STYLE_PRICES[key];
    const first = name.split(/[-–]/)[0].trim().toLowerCase();
    const match = Object.keys(STYLE_PRICES).find(
      (k) => k.toLowerCase().startsWith(first) && first.length > 2,
    );
    return match ? STYLE_PRICES[match] : undefined;
  };
  const selectedStylePrice = stylePriceFor(selectedStyle);
  const effectivePrice = selectedStylePrice ?? displayPrice;
  const SIZE_CHART: Array<{ size: string; inches: string; cm: string }> = [
    { size: "XS", inches: "22.0", cm: "55.9" },
    { size: "S", inches: "22.5", cm: "57.2" },
    { size: "M", inches: "23.0", cm: "58.4" },
    { size: "L", inches: "23.5", cm: "59.7" },
    { size: "XL", inches: "24.0", cm: "61.0" },
    { size: "XXL", inches: "24.5", cm: "62.2" },
    { size: "XXXL", inches: "25.0", cm: "63.5" },
  ];

  const addToCart = () => {
    if (!inStock) return toast.error("Out of stock");
    const style = selectedStyle || (STYLE_OPTIONS.length === 1 ? STYLE_OPTIONS[0] : "");
    if (STYLE_OPTIONS.length > 0 && !style) return toast.error("Please select a style");
    if (SIZE_OPTIONS.length > 0 && !selectedSize) return toast.error("Please select a size");
    const size = selectedSize;
    const suffixParts = [style, size].filter(Boolean);
    const displayName = suffixParts.length ? `${product.name} — ${suffixParts.join(" / ")}` : product.name;
    const idParts = [product.id, style, size].filter(Boolean);
    const cartId = idParts.join("::");
    const priceToUse = stylePriceFor(style) ?? displayPrice;
    add({ id: cartId, name: displayName, price: priceToUse, image: images[0], stock }, qty);
    toast.success(`Added ${qty} × ${displayName} to cart`);
  };

  return (
    <StoreLayout>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
              {images[imgIdx] ? (
                <img src={images[imgIdx]} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center text-muted-foreground">No image</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`h-20 w-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${i === imgIdx ? "border-primary" : "border-transparent"}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {/* {product.style && <span className="text-xs uppercase tracking-widest text-primary font-semibold">{product.style}</span>} */}
            <h1 className="mt-2 font-display text-4xl font-bold">{product.name}</h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-primary">{formatNaira(effectivePrice)}</span>
              {hasSale && selectedStylePrice == null && (
                <span className="text-lg line-through text-muted-foreground">{formatNaira(product.price)}</span>
              )}
            </div>

            <p className={`mt-3 text-sm font-medium ${inStock ? "text-green-600" : "text-destructive"}`}>
              {inStock ? (stock <= 5 ? `Only ${stock} left in stock` : "In stock") : "Out of stock"}
            </p>

            <p className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description || product.shortDescription || ""}
            </p>

            {STYLE_OPTIONS.length > 0 && (
              <div className="mt-6">
                <label className="text-xs uppercase tracking-widest text-primary font-semibold">
                  Select Style
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="mt-2 w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Choose a style…</option>
                  {STYLE_OPTIONS.map((name) => {
                    const sp = stylePriceFor(name);
                    return (
                      <option key={name} value={name}>
                        {name}{sp != null ? ` — ${formatNaira(sp)}` : ""}
                      </option>
                    );
                  })}
                </select>
                {selectedStyle && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    You selected <span className="font-semibold text-foreground">{selectedStyle}</span>
                    {selectedStylePrice != null && (
                      <> at <span className="font-semibold text-primary">{formatNaira(selectedStylePrice)}</span></>
                    )}.
                  </p>
                )}
              </div>
            )}

            {SIZE_OPTIONS.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-widest text-primary font-semibold">
                    Select Size
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSizeChart(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <Ruler className="h-3.5 w-3.5" /> Size chart
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((s) => {
                    const active = selectedSize === s;
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[3rem] rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card hover:border-primary/50"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                {selectedSize && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    You selected size <span className="font-semibold text-foreground">{selectedSize}</span>.
                  </p>
                )}
              </div>
            )}



            <div className="mt-8 flex items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:bg-muted rounded-l-full"><Minus className="h-4 w-4" /></button>
                <span className="px-4 font-medium min-w-[2rem] text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="p-3 hover:bg-muted rounded-r-full"><Plus className="h-4 w-4" /></button>
              </div>
              <button
                onClick={addToCart}
                disabled={!inStock}
                className="flex-1 rounded-full bg-primary text-primary-foreground py-3.5 font-semibold hover:opacity-90 disabled:opacity-50 transition inline-flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                {inCart ? `Add ${qty} more` : "Add to Cart"}
              </button>
            </div>

            {inCart && (
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/cart"
                  className="flex-1 min-w-[160px] rounded-full bg-secondary text-secondary-foreground py-3 font-semibold text-center inline-flex items-center justify-center gap-2 hover:opacity-90 transition"
                >
                  Proceed to Order <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/shop"
                  className="flex-1 min-w-[160px] rounded-full border border-primary/30 bg-primary/5 text-primary py-3 font-semibold text-center hover:bg-primary/10 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-24">
          <h2 className="font-display text-3xl font-bold">Customer Reviews</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {(!reviews || reviews.length === 0) && (
                <p className="text-muted-foreground">No reviews yet. Be the first to review.</p>
              )}
              {reviews?.map((r) => (
                <div key={r.reviewId || r.id} className="rounded-2xl border border-border p-5 bg-card">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-secondary text-secondary" : "text-muted-foreground/40"}`} />
                    ))}
                    <span className="ml-2 text-sm font-medium">{r.customerName}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.review}</p>
                </div>
              ))}
            </div>
            <ReviewForm productId={id} onSubmitted={() => refetchReviews()} />
          </div>
        </section>
      </div>

      {showSizeChart && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          onClick={() => setShowSizeChart(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl border-y-4 border-secondary bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-display text-xl font-bold tracking-wide">SIZE CHART</h3>
              <button
                type="button"
                onClick={() => setShowSizeChart(false)}
                className="rounded-full p-1.5 hover:bg-muted"
                aria-label="Close size chart"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-card px-4 py-3 text-sm font-semibold uppercase tracking-widest text-primary">
                <div>Size</div>
                <div className="text-center">Inches</div>
                <div className="text-right">CM</div>
              </div>
              <ul className="mt-2 divide-y divide-border/60">
                {SIZE_CHART.map((row) => {
                  const active = selectedSize === row.size;
                  return (
                    <li
                      key={row.size}
                      className={`grid grid-cols-3 items-center gap-2 px-4 py-3 text-sm ${
                        active ? "bg-primary/10 rounded-lg" : ""
                      }`}
                    >
                      <span className="font-bold">{row.size}</span>
                      <span className="text-center tabular-nums">{row.inches}</span>
                      <span className="text-right tabular-nums">{row.cm}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Measurements are head circumference. Choose the size closest to your measurement.
              </p>
            </div>
          </div>
        </div>
      )}
    </StoreLayout>
  );
}


function ReviewForm({ productId, onSubmitted }: { productId: string; onSubmitted: () => void }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !review) return toast.error("Please fill your name and review.");
    setBusy(true);
    try {
      const r = await apiPost("reviews", { customerName: name, productId, rating, review });
      if (!r.success) throw new Error(r.message || "Could not submit");
      toast.success("Thanks! Your review is pending approval.");
      setName(""); setReview(""); setRating(5);
      onSubmitted();
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border p-5 bg-card h-fit">
      <h3 className="font-display text-xl font-bold">Leave a review</h3>
      <div className="mt-4 space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button type="button" key={i} onClick={() => setRating(i + 1)}>
              <Star className={`h-6 w-6 ${i < rating ? "fill-secondary text-secondary" : "text-muted-foreground/40"}`} />
            </button>
          ))}
        </div>
        <textarea value={review} onChange={(e) => setReview(e.target.value)} rows={4} placeholder="Share your experience" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <button disabled={busy} className="w-full rounded-full bg-primary text-primary-foreground py-2.5 font-semibold disabled:opacity-50">
          {busy ? "Submitting…" : "Submit review"}
        </button>
      </div>
    </form>
  );
}