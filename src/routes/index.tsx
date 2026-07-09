import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Award, Truck, ChevronDown } from "lucide-react";
import { StoreLayout, useSettings } from "@/components/StoreLayout";
import { ProductCard, type Product } from "@/components/ProductCard";
import { apiGet } from "@/lib/api";
import { withDemoFallback } from "@/lib/demo-products";
import heroFila from "@/assets/hero-fila.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const STYLES = [
  { name: "Adisa", tag: "Hard band", desc: "Structured, regal — the signature statement piece." },
  { name: "Ishola", tag: "Soft band", desc: "Comfortable, refined and endlessly wearable." },
  { name: "Akanni", tag: "No band", desc: "Free-form, contemporary elegance." },
  { name: "Otunba", tag: "Hand netted", desc: "Intricate netted craftsmanship for the connoisseur." },
];

function HomePage() {
  const { data: settings } = useSettings();
  const { data: featured, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      try {
        const r = await apiGet<Product[] | { products?: Product[] }>("products", { id: "featured" });
        const d = r.data as unknown;
        const list = Array.isArray(d)
          ? (d as Product[])
          : ((d as { products?: Product[] } | null | undefined)?.products ?? []);
        return list;
      } catch {
        return [] as Product[];
      }
    },
  });

  const displayFeatured = withDemoFallback(featured).slice(0, 4);

  return (
    <StoreLayout>
      {/* ============ PREMIUM HERO ============ */}
      <section className="relative min-h-[92vh] w-full overflow-hidden bg-primary text-primary-foreground">
        {/* Hero image */}
        <img
          src={heroFila}
          alt="Yoruba gentleman in premium Agbada and Fìlá Òóduá cap"
          width={1280}
          height={1600}
          className="absolute inset-0 h-full w-full object-cover object-[70%_center] sm:object-[75%_center] md:object-right"
        />

        {/* Luxury gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-primary/40" />

        {/* Subtle floating Yoruba-inspired decorative patterns */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg
            className="absolute -top-10 -left-10 h-72 w-72 text-secondary/15 animate-[float_14s_ease-in-out_infinite]"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" />
            <path d="M100 20 L108 92 L180 100 L108 108 L100 180 L92 108 L20 100 L92 92 Z" fill="currentColor" />
          </svg>
          <svg
            className="absolute bottom-16 left-1/3 h-40 w-40 text-secondary/10 animate-[float_18s_ease-in-out_infinite_reverse]"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path d="M50 5 L60 40 L95 50 L60 60 L50 95 L40 60 L5 50 L40 40 Z" fill="currentColor" />
          </svg>
          <svg
            className="absolute top-1/3 right-10 h-56 w-56 text-secondary/10 animate-[float_20s_ease-in-out_infinite]"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-10 py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-secondary backdrop-blur">
              <Sparkles className="h-3 w-3" />
              Handcrafted Yoruba Heritage
            </span>

            <h1 className="mt-8 font-display text-5xl leading-[1.02] font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-[5.25rem]">
              Wear Your Heritage.
              <span className="mt-2 block bg-gradient-to-r from-secondary via-secondary to-secondary/70 bg-clip-text text-transparent">
                Make a Statement.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              Premium Yoruba <em className="not-italic font-medium text-secondary">Fìlá</em> —
              celebrating culture, elegance, and centuries of craftsmanship in every stitch.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-secondary px-9 py-4 text-sm font-semibold tracking-wide text-secondary-foreground shadow-2xl shadow-secondary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-secondary/50"
              >
                Shop Collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#styles"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/5 px-9 py-4 text-sm font-semibold tracking-wide backdrop-blur transition hover:border-secondary/60 hover:bg-primary-foreground/10"
              >
                Explore Styles
              </a>
            </div>

            {/* Small brand tag row */}
            <div className="mt-14 hidden items-center gap-6 text-[11px] uppercase tracking-[0.3em] text-primary-foreground/60 sm:flex">
              <span>Est. Heritage</span>
              <span className="h-px w-8 bg-primary-foreground/30" />
              <span>Master Artisans</span>
              <span className="h-px w-8 bg-primary-foreground/30" />
              <span>Made in Nigeria</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#styles"
          aria-label="Scroll to explore"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-primary-foreground/70 transition hover:text-secondary"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </div>
        </a>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-center sm:grid-cols-3 sm:px-6">
          {[
            { icon: Award, title: "Master Craftsmanship", desc: "Handmade by Yoruba artisans" },
            { icon: Sparkles, title: "Premium Materials", desc: "Only the finest fabrics" },
            { icon: Truck, title: "Nationwide Delivery", desc: "Fast, tracked shipping" },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center">
              <f.icon className="h-6 w-6 text-primary" />
              <div className="mt-3 font-display font-semibold">{f.title}</div>
              <div className="text-sm text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-24 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">About Fìlá Òóduá</span>
        <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold">Every design tells a story.</h2>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          {settings?.about ||
            "At Fìlà Òóduá, every design tells a story — make a cultural statement and preserve the Yoruba heritage. Our caps are more than fashion; they are woven history."}
        </p>
      </section>

      {/* Styles */}
      <section id="styles" className="bg-muted/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our Signature Styles</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold">Four ways to wear your heritage.</h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STYLES.map((s) => (
              <Link
                key={s.name}
                to="/shop"
                search={{ style: s.name } as never}
                className="group rounded-3xl bg-card p-8 border border-border/50 hover:border-secondary hover:shadow-xl transition"
              >
                <div className="h-14 w-14 rounded-2xl bg-secondary/30 grid place-items-center font-display font-bold text-2xl text-primary">
                  {s.name[0]}
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold">{s.name}</h3>
                <p className="text-xs uppercase tracking-widest text-primary mt-1">{s.tag}</p>
                <p className="mt-3 text-sm text-muted-foreground">{s.desc}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  Shop {s.name} <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Featured</span>
            <h2 className="mt-2 font-display text-4xl font-bold">New Arrivals</h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 grid-cols-2 lg:grid-cols-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
            ))}
          {!isLoading && displayFeatured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </StoreLayout>
  );
}
