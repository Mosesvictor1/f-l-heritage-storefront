import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingBag, Users, DollarSign, Clock, CheckCircle } from "lucide-react";
import { AdminLayout, useAdminGuard } from "@/components/AdminLayout";
import { apiGet, formatNaira } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardPage,
});

interface Stats {
  productsCount: number;
  ordersCount: number;
  customersCount: number;
  revenue: number;
  pendingOrders: number;
  completedOrders: number;
  monthlySales?: Record<string, number>;
}

function DashboardPage() {
  const ready = useAdminGuard();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await apiGet<Stats>("dashboard")).data as Stats,
    enabled: ready,
  });

  if (!ready) return null;
  const cards = [
    { icon: Package, label: "Products", val: data?.productsCount ?? 0 },
    { icon: ShoppingBag, label: "Orders", val: data?.ordersCount ?? 0 },
    { icon: Users, label: "Customers", val: data?.customersCount ?? 0 },
    { icon: DollarSign, label: "Revenue", val: formatNaira(data?.revenue ?? 0) },
    { icon: Clock, label: "Pending", val: data?.pendingOrders ?? 0 },
    { icon: CheckCircle, label: "Completed", val: data?.completedOrders ?? 0 },
  ];
  const chartData = Object.entries(data?.monthlySales || {}).map(([month, sales]) => ({ month, sales: Number(sales) }));

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-card border border-border p-5">
            <c.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{isLoading ? "…" : c.val}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border p-6">
        <h2 className="font-display text-lg font-bold">Monthly Sales</h2>
        <div className="h-72 mt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(v: number) => formatNaira(v)} />
                <Line type="monotone" dataKey="sales" stroke="oklch(0.32 0.14 258)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground grid place-items-center h-full">No sales data yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}