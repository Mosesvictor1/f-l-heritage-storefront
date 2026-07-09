import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Star, Minus, Plus, ArrowLeft } from "lucide-react";
import { StoreLayout } from "@/components/StoreLayout";
import { apiGet, apiPost, formatNaira } from "@/lib/api";
import type { Product } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import { DEMO_PRODUCTS } from "@/lib/demo-products";

export const Route = createFileRoute("/products/$id")({
  component: ProductPage,
});

interface Review {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  status?: string;
  createdAt?: string;
}

function ProductPage() {
  const { id } = Route.useParams();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const r = await apiGet<Product>("products", { id });
      return r.data as Product;
    },
  });

  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const r = await apiGet<Review[] | { reviews?: Review[] }>("reviews", { productId: id, status: "approved" });
      const d = r.data as any;
      const list = (Array.isArray(d) ? d : d?.reviews || []) as Review[];
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

  const addToCart = () => {
    if (!inStock) return toast.error("Out of stock");
    add({ id: product.id, name: product.name, price: displayPrice, image: images[0], stock }, qty);
    toast.success(`Added ${qty} × ${product.name} to cart`);
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
            {product.style && <span className="text-xs uppercase tracking-widest text-primary font-semibold">{product.style}</span>}
            <h1 className="mt-2 font-display text-4xl font-bold">{product.name}</h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-primary">{formatNaira(displayPrice)}</span>
              {hasSale && <span className="text-lg line-through text-muted-foreground">{formatNaira(product.price)}</span>}
            </div>

            <p className={`mt-3 text-sm font-medium ${inStock ? "text-green-600" : "text-destructive"}`}>
              {inStock ? (stock <= 5 ? `Only ${stock} left in stock` : "In stock") : "Out of stock"}
            </p>

            <p className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description || product.shortDescription || ""}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:bg-muted rounded-l-full"><Minus className="h-4 w-4" /></button>
                <span className="px-4 font-medium min-w-[2rem] text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="p-3 hover:bg-muted rounded-r-full"><Plus className="h-4 w-4" /></button>
              </div>
              <button
                onClick={addToCart}
                disabled={!inStock}
                className="flex-1 rounded-full bg-primary text-primary-foreground py-3.5 font-semibold hover:opacity-90 disabled:opacity-50 transition"
              >
                Add to Cart
              </button>
            </div>
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
                <div key={r.id} className="rounded-2xl border border-border p-5 bg-card">
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