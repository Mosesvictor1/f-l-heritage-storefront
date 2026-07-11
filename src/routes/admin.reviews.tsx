
import { createFileRoute } from "@tanstack/react-router";




import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, X, Trash2, Star } from "lucide-react";
import { AdminLayout, useAdminGuard } from "@/components/AdminLayout";
import { apiGet, apiPost } from "@/lib/api";

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviews,
});

interface Review {
  id?: string;
  reviewId: string;
  customerName: string;
  productId: string;
  productName?: string;
  rating: number;
  review: string;
  status?: string;
  createdAt?: string;
}

function AdminReviews() {
  const ready = useAdminGuard();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: async () => {
      const r = await apiGet<{ items?: Review[] } | Review[] | { reviews?: Review[] }>("reviews", { limit: 200 });
      const d = r.data as any;
      return (Array.isArray(d) ? d : d?.items || d?.reviews || []) as Review[];
    },
    enabled: ready,
  });

  const setStatus = async (reviewId: string, status: string) => {
    const r = await apiPost("reviews", { status }, "PUT", reviewId);
    if (r.success) { toast.success("Updated"); refetch(); } else toast.error(r.message || "Failed");
  };
  const del = async (reviewId: string) => {
    if (!confirm("Delete review?")) return;
    const r = await apiPost("reviews", {}, "DELETE", reviewId);
    if (r.success) { toast.success("Deleted"); refetch(); } else toast.error(r.message || "Failed");
  };

  if (!ready) return null;
  return (
    <AdminLayout title="Reviews">
      <div className="grid gap-3">
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {data?.map((r) => (
          <div key={r.reviewId || r.id} className="rounded-2xl bg-card border border-border p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-secondary text-secondary" : "text-muted-foreground/40"}`} />
                  ))}
                  <span className="text-sm font-medium">{r.customerName}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{r.status || "pending"}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.review}</p>
                <p className="mt-1 text-xs text-muted-foreground">Product: {r.productName || r.productId}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStatus(r.reviewId || r.id || "", "approved")} className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"><Check className="h-4 w-4" /></button>
                <button onClick={() => setStatus(r.reviewId || r.id || "", "rejected")} className="p-2 rounded-lg bg-muted hover:bg-muted/70"><X className="h-4 w-4" /></button>
                <button onClick={() => del(r.reviewId || r.id || "")} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {data && data.length === 0 && <p className="text-muted-foreground text-center py-8">No reviews.</p>}
      </div>
    </AdminLayout>
  );
}