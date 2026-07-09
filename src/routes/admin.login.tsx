import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await apiPost<{ token: string; admin: unknown }>("auth", { username, password }, "POST", "login");
      if (!r.success || !r.data?.token) throw new Error(r.message || "Login failed");
      localStorage.setItem("admin_token", r.data.token);
      localStorage.setItem("admin_user", JSON.stringify(r.data.admin));
      toast.success("Welcome back.");
      navigate({ to: "/admin/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-primary text-primary-foreground p-4 font-sans">
      <form onSubmit={submit} className="w-full max-w-sm bg-card text-card-foreground rounded-3xl p-8 shadow-2xl">
        <Link to="/" className="block text-center font-display text-2xl font-bold text-primary">Fìlá Òóduá</Link>
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mt-1">Admin Login</p>
        <div className="mt-6 space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" required />
          <button disabled={busy} className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 font-semibold disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}