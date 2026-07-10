import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { apiGet } from "@/lib/api";
import { useCart } from "@/lib/cart";
import logoAsset from "@/assets/fila-logo.png";

interface Settings {
  storeName?: string;
  logoUrl?: string;
  whatsappNumber?: string;
  instagram?: string;
  tiktok?: string;
  email?: string;
  phone?: string;
  about?: string;
  address?: string;
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const r = await apiGet<Settings>("settings");
      return (r.data || {}) as Settings;
    },
    staleTime: 5 * 60 * 1000,
  });
}

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/order-lookup", label: "Track Order" },
];

export function StoreLayout({ children }: { children: ReactNode }) {
  const { count } = useCart();
  const { data: settings } = useSettings();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <img
              src={settings?.logoUrl || logoAsset}
              alt="Fìlá Òóduá"
              className="h-10 w-10 object-contain shrink-0"
            />
            <span className="font-display font-bold text-lg sm:text-xl truncate">
              {settings?.storeName || "Fìlá Òóduá"}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === n.to ? "text-primary" : "text-foreground/80"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-muted transition">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold grid place-items-center">
                  {count}
                </span>
              )}
            </Link>
            <button className="md:hidden p-2 rounded-full hover:bg-muted" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-border/60 bg-background">
            <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 px-3 rounded-md hover:bg-muted text-sm font-medium">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-24 border-t border-border/60 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-display text-2xl font-bold">{settings?.storeName || "Fìlá Òóduá"}</h3>
            <p className="mt-3 text-sm text-primary-foreground/80 max-w-sm">
              {settings?.about || "Wear your heritage. Premium handcrafted Yoruba caps that celebrate culture, elegance and craftsmanship."}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-3 text-secondary">Explore</h4>
            <ul className="space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.to}><Link to={n.to} className="hover:text-secondary">{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-3 text-secondary">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              {settings?.phone && <li>Tel: {settings.phone}</li>}
              {settings?.email && <li>Email: {settings.email}</li>}
              {settings?.address && <li>{settings.address}</li>}
              {settings?.whatsappNumber && (
                <li>
                  <a target="_blank" rel="noreferrer" href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`} className="hover:text-secondary">
                    WhatsApp us
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} {settings?.storeName || "Fìlá Òóduá"}. Make a cultural statement.
        </div>
      </footer>
    </div>
  );
}