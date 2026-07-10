import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Award, Truck, ChevronDown, Loader2 } from "lucide-react";
import { StoreLayout, useSettings } from "@/components/StoreLayout";
import { ProductCard, type Product } from "@/components/ProductCard";
import { apiGet } from "@/lib/api";
import { withDemoFallback } from "@/lib/demo-products";
import heroFila1 from "@/assets/hero-fila-1.jpg";
import heroFila2 from "@/assets/hero-fila-2.jpg";
import heroFila4 from "@/assets/hero-fila-4.jpg";
import heroFila5 from "@/assets/hero-fila-5.jpg";
import heroFila6 from "@/assets/hero-fila-6.jpg";
import heroBrownAgbada from "@/assets/hero-brown-agbada.jpg.asset.json";
import styleAdisa from "@/assets/style-adisa.jpg";
import styleIshola from "@/assets/style-ishola.jpg";
import styleAkanni from "@/assets/style-akanni.jpg";
import styleOtunba from "@/assets/style-otunba.jpg";
import styleAbetiAja from "@/assets/style-abeti-aja.jpg";
import { formatNaira } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const HERO_IMAGES = [
  { src: heroBrownAgbada.url, alt: "Yoruba gentleman in brown agbada with matching Fìlá cap and gold beads" },
  { src: heroFila1, alt: "Yoruba gentleman wearing a navy velvet Fìlá Òóduá cap with gold embroidery" },
  { src: heroFila2, alt: "Young Yoruba man wearing a burgundy soft-band Fìlá Òóduá cap" },
  { src: heroFila4, alt: "Distinguished Yoruba man wearing a royal purple velvet Fìlá with gold embroidery" },
  { src: heroFila5, alt: "Stylish young Yoruba man wearing a forest green aso-oke Fìlá" },
  { src: heroFila6, alt: "Regal Yoruba chief wearing a wine red Fìlá Abetí Ajá with coral beads" },
];

const STYLES = [
  { name: "Adisa", tag: "Hard band", price: 10000, image: styleAdisa },
  { name: "Ishola", tag: "Soft band", price: 10000, image: styleIshola },
  { name: "Akanni", tag: "No band", price: 10000, image: styleAkanni },
  { name: "Otunba", tag: "Hand netted", price: 15000, image: styleOtunba },
  { name: "Abeti Aja", tag: "Signature", price: 15000, image: styleAbetiAja },
];

function extractList(d: unknown): Product[] {
  return Array.isArray(d)
    ? (d as Product[])
    : ((d as { products?: Product[] } | null | undefined)?.products ?? []);
}

function SectionSpinner() {
  return (
    <div className="flex w-full items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="sr-only">Loading products…</span>
    </div>
  );
}

function HomePage() {
  const { data: settings } = useSettings();

  // Featured products from the API — powers "New Arrivals"
  const { data: featured, isLoading: featuredLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      try {
        const r = await apiGet<Product[] | { products?: Product[] }>("products", { id: "featured" });
        return extractList(r.data as unknown);
      } catch {
        return [] as Product[];
      }
    },
  });

  // All products from the API — powers "Popular Products"
  const { data: allProducts, isLoading: allLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      try {
        const r = await apiGet<Product[] | { products?: Product[] }>("products");
        return extractList(r.data as unknown);
      } catch {
        return [] as Product[];
      }
    },
  });

  const newArrivals = withDemoFallback(featured).slice(0, 10);
  const popular = withDemoFallback(allProducts).slice(0, 8);

  // Hero image crossfade rotation
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <StoreLayout>
      {/* ============ PREMIUM HERO ============ */}
      <section className="relative min-h-[62vh] w-full overflow-hidden bg-primary text-primary-foreground">
        {/* Rotating hero images with smooth crossfade */}
        {HERO_IMAGES.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            width={1280}
            height={1600}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover object-[70%_20%] sm:object-[75%_20%] md:object-[right_20%] transition-opacity duration-[1500ms] ease-in-out ${
              i === heroIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Luxury gradient overlays — lighter so images show through */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/75 via-primary/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-primary/15" />

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
        <div className="relative mx-auto flex min-h-[62vh] max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-10 py-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-secondary backdrop-blur">
              <Sparkles className="h-3 w-3" />
              Handcrafted Yoruba Heritage
            </span>

            <h1 className="mt-6 font-display text-4xl leading-[1.02] font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Wear Your Heritage.
              <span className="mt-2 block bg-gradient-to-r from-secondary via-secondary to-secondary/70 bg-clip-text text-transparent">
                Make a Statement.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              Premium Yoruba <em className="not-italic font-medium text-secondary">Fìlá</em> —
              celebrating culture, elegance, and centuries of craftsmanship in every stitch.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-secondary px-9 py-4 text-sm font-semibold tracking-wide text-secondary-foreground shadow-2xl shadow-secondary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-secondary/50"
              >
                Shop Collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#new-arrivals"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/5 px-9 py-4 text-sm font-semibold tracking-wide backdrop-blur transition hover:border-secondary/60 hover:bg-primary-foreground/10"
              >
                New Arrivals
              </a>
            </div>

            {/* Small brand tag row */}
            <div className="mt-9 hidden items-center gap-6 text-[11px] uppercase tracking-[0.3em] text-primary-foreground/60 sm:flex">
              <span>Est. Heritage</span>
              <span className="h-px w-8 bg-primary-foreground/30" />
              <span>Master Artisans</span>
              <span className="h-px w-8 bg-primary-foreground/30" />
              <span>Made in Nigeria</span>
            </div>
          </div>
        </div>

        {/* Hero image dots */}
        <div className="absolute bottom-8 right-6 z-10 flex gap-2 sm:right-10">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              aria-label={`Show hero image ${i + 1}`}
              onClick={() => setHeroIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === heroIndex ? "w-8 bg-secondary" : "w-3 bg-primary-foreground/40 hover:bg-primary-foreground/70"
              }`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <a
          href="#new-arrivals"
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

       {/* Styles — horizontal scroll */}
      <section id="styles" className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our Signature Styles</span>
              <h2 className="mt-2 font-display text-4xl font-bold">Five ways to wear your heritage.</h2>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 -mx-4 px-4 sm:-mx-6 sm:px-6">
            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:thin]">
              {STYLES.map((s) => (
                <Link
                  key={s.name}
                  to="/shop"
                  search={{ style: s.name } as never}
                  className="group w-[220px] shrink-0 snap-start sm:w-[260px] rounded-2xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img src={s.image} alt={`${s.name} Fìlá — ${s.tag}`} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <h3 className="font-display font-semibold text-lg">{s.name}</h3>
                    <span className="text-primary font-bold">{formatNaira(s.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ NEW ARRIVALS — horizontal scroll ============ */}
      <section id="new-arrivals" className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-4">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Just In</span>
            <h2 className="mt-2 font-display text-4xl font-bold">New Arrivals</h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {featuredLoading ? (
          <SectionSpinner />
        ) : (
          <div className="mt-8 -mx-4 px-4 sm:-mx-6 sm:px-6">
            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:thin]">
              {newArrivals.map((p) => (
                <div key={p.id} className="w-[240px] shrink-0 snap-start sm:w-[280px]">
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ============ POPULAR PRODUCTS — 2 rows ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Customer Favourites</span>
            <h2 className="mt-2 font-display text-4xl font-bold">Our Fila Collections</h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {allLoading ? (
          <SectionSpinner />
        ) : (
          <div className="mt-10 grid gap-6 grid-cols-2 lg:grid-cols-4">
            {popular.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
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

     
    </StoreLayout>
  );
}
