import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Award, Truck } from "lucide-react";
import { StoreLayout, useSettings } from "@/components/StoreLayout";
import { ProductCard, type Product } from "@/components/ProductCard";
import { apiGet } from "@/lib/api";

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
      const r = await apiGet<Product[] | { products?: Product[] }>("products", { id: "featured" });
      const d = r.data as any;
      return (Array.isArray(d) ? d : d?.products || []) as Product[];
    },
  });

  return (
    <StoreLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 sm:py-32 text-primary-foreground">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/20 border border-secondary/40 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-secondary">
              <Sparkles className="h-3 w-3" /> Handcrafted Yoruba Heritage
            </span>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05]">
              {settings?.about ? (settings?.storeName || "Fìlá Òóduá") : "Wear Your Heritage."}
              <span className="block text-secondary">Make a Statement.</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl">
              Premium Yoruba Fìlá — celebrating culture, elegance, and centuries of craftsmanship in every stitch.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-8 py-4 font-semibold hover:brightness-95 transition shadow-lg shadow-secondary/30">
                Shop the Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#styles" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-8 py-4 font-semibold hover:bg-primary-foreground/10 transition">
                Explore Styles
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3 text-center">
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
                search={{ style: s.name } as any}
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
          {!isLoading && featured?.slice(0, 8).map((p) => <ProductCard key={p.id} p={p} />)}
          {!isLoading && (!featured || featured.length === 0) && (
            <p className="col-span-full text-center text-muted-foreground py-12">Featured products coming soon.</p>
          )}
        </div>
      </section>
    </StoreLayout>
  );
}