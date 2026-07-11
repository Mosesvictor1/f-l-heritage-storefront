import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Loader2, MessageCircle, Upload, X } from "lucide-react";
import { apiPost, uploadToCloudinary, formatNaira } from "@/lib/api";
import { useSettings } from "@/components/StoreLayout";

export interface OrderResult {
  orderId: string;
  total: number;
  subtotal?: number;
  deliveryFee?: number;
  bankDetails?: { bankName?: string; accountName?: string; accountNumber?: string };
  whatsappNumber?: string;
  paymentStatus?: string;
  orderStatus?: string;
}

export function PaymentModal({
  order,
  customerName,
  onClose,
}: {
  order: OrderResult;
  customerName: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const { data: settings } = useSettings();

  const bank = order.bankDetails || {};
  const acct = bank.accountNumber || "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(acct);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy");
    }
  };

  const getCleanNumber = () => {
    const rawNumber = settings?.whatsappNumber || order.whatsappNumber || "2348166963223";
    let num = rawNumber.replace(/\D/g, "");
    if (num.startsWith("0")) {
      num = "234" + num.slice(1);
    } else if (num.length === 10 && (num.startsWith("7") || num.startsWith("8") || num.startsWith("9"))) {
      num = "234" + num;
    }
    return num;
  };

  const openWhatsapp = () => {
    const num = getCleanNumber();
    const msg = encodeURIComponent(
      `Hi, I've made payment for Order ${order.orderId} (${customerName}). Here is my receipt.`,
    );
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      const r = await apiPost("orders", { orderId: order.orderId, receiptUrl: url }, "POST", "receipt");
      if (!r.success) throw new Error(r.message || "Failed to attach receipt");
      setUploaded(true);
      toast.success("Receipt received! We'll confirm your payment shortly.");

      const num = getCleanNumber();
      const msg = encodeURIComponent(
        `Hi, I've made payment for Order ${order.orderId} (${customerName}). Here is my receipt.`,
      );
      setTimeout(() => {
        window.location.href = `https://wa.me/${num}?text=${msg}`;
      }, 1500);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-card rounded-3xl shadow-2xl relative my-8">
        <button
          aria-label="Close"
          onClick={() => (uploaded ? onClose() : setConfirmClose(true))}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <h2 className="font-display text-2xl font-bold text-center">Complete Your Payment</h2>
          <p className="text-center text-sm text-muted-foreground mt-1">Order placed successfully.</p>

          <div className="mt-6 rounded-2xl bg-primary text-primary-foreground p-6 text-center">
            <div className="text-xs uppercase tracking-widest opacity-80">Order ID</div>
            <div className="font-display text-xl font-semibold mt-1">{order.orderId}</div>
            <div className="text-xs uppercase tracking-widest opacity-80 mt-4">Amount to pay</div>
            <div className="font-display text-3xl font-bold text-secondary mt-1">{formatNaira(order.total)}</div>
          </div>

          <div className="mt-6 rounded-2xl border border-border p-5 space-y-3">
            <p className="text-sm text-muted-foreground">Transfer the exact amount above to:</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="text-muted-foreground">Bank</span>
              <span className="col-span-2 font-medium">{bank.bankName || "—"}</span>
              <span className="text-muted-foreground">Account Name</span>
              <span className="col-span-2 font-medium">{bank.accountName || "—"}</span>
              <span className="text-muted-foreground">Account No.</span>
              <span className="col-span-2 font-semibold flex items-center gap-2">
                {acct}
                {acct && (
                  <button onClick={copy} className="p-1 rounded hover:bg-muted" aria-label="Copy">
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
              </span>
            </div>
          </div>

          <p className="mt-5 text-sm text-center text-muted-foreground">
            After transferring, confirm your payment using either option below.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              onClick={openWhatsapp}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium py-3 transition"
            >
              <MessageCircle className="h-4 w-4" /> Send on WhatsApp
            </button>
            <label className="flex items-center justify-center gap-2 rounded-xl bg-secondary hover:brightness-95 text-secondary-foreground font-medium py-3 cursor-pointer transition">
              {uploading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
              ) : uploaded ? (
                <><Check className="h-4 w-4" /> Receipt sent</>
              ) : (
                <><Upload className="h-4 w-4" /> Upload Receipt</>
              )}
              <input type="file" accept="image/*" className="hidden" disabled={uploading || uploaded} onChange={onFile} />
            </label>
          </div>

          {uploaded && (
            <button
              onClick={onClose}
              className="mt-4 w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold hover:opacity-90"
            >
              Done
            </button>
          )}
        </div>

        {confirmClose && !uploaded && (
          <div className="absolute inset-0 rounded-3xl bg-background/95 grid place-items-center p-8">
            <div className="text-center max-w-sm">
              <h3 className="font-display text-xl font-bold">Close without confirming payment?</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your order <b>{order.orderId}</b> is saved. You can send your receipt later on WhatsApp using this order ID.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setConfirmClose(false)} className="flex-1 rounded-xl border border-border py-3 font-medium hover:bg-muted">
                  Go back
                </button>
                <button onClick={onClose} className="flex-1 rounded-xl bg-primary text-primary-foreground py-3 font-medium">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}