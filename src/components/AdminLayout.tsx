import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutDashboard, Package, ShoppingBag, Users, Star, Settings, LogOut, Menu, X } from "lucide-react";
import { apiPost } from "@/lib/api";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function useAdminGuard() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
    if (!t) { navigate({ to: "/admin/login" }); return; }
    setReady(true);
  }, [navigate]);
  return ready;
}

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    try { await apiPost("auth", {}, "POST", "logout"); } catch {}
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex font-sans">
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-primary text-primary-foreground p-6 flex flex-col transition-transform ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <Link to="/" className="font-display text-xl font-bold text-secondary">Fìlá Òóduá</Link>
        <p className="text-xs uppercase tracking-widest opacity-60 mt-1">Admin Panel</p>
        <nav className="mt-8 space-y-1 flex-1">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${active ? "bg-secondary text-secondary-foreground font-semibold" : "hover:bg-primary-foreground/10"}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-primary-foreground/10">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border h-16 flex items-center px-4 sm:px-6 gap-4">
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 rounded hover:bg-muted">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="font-display text-xl font-bold truncate">{title}</h1>
        </header>
        <main className="p-4 sm:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}