"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, LockKeyhole, PackageCheck } from "lucide-react";
import { money, productName } from "@/lib/product";

type FieldErrors = Record<string, string[] | undefined>;

export default function CheckoutForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const order = useMemo(() => {
    const quantity = Math.max(1, Number(params.get("quantity") || "1"));
    const pricePerPiece = Math.max(1, Number(params.get("pricePerPiece") || "450"));
    const totalPrice = Math.max(pricePerPiece, Number(params.get("totalPrice") || quantity * pricePerPiece));
    return {
      productName: params.get("productName") || `${productName} - 1 Liter Bottle`,
      quantity,
      pricePerPiece,
      totalPrice
    };
  }, [params]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const payload = {
      customerName: String(formData.get("customerName") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      location: String(formData.get("location") || ""),
      ...order
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.error || "Order submission failed. Please try again.");
        setFieldErrors(result.fields || {});
        return;
      }

      const thankYouParams = new URLSearchParams({
        orderId: result.order.orderId,
        productName: result.order.productName,
        quantity: String(result.order.quantity),
        totalPrice: String(result.order.totalPrice)
      });
      router.push(`/thank-you?${thankYouParams.toString()}`);
    } catch {
      setError("Could not submit the order. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function fieldError(name: string) {
    return fieldErrors[name]?.[0];
  }

  return (
    <main className="min-h-screen py-8">
      <div className="section-shell">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-braniva-green">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr]">
          <section className="rounded-lg bg-white p-5 shadow-soft ring-1 ring-braniva-earth sm:p-8">
            <div className="flex items-center gap-3">
              <Image src="/images/braniva-logo.png" alt="Braniva Oils logo" width={120} height={74} className="h-16 w-auto object-contain" />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-braniva-gold">Cash on Delivery</p>
                <h1 className="text-3xl font-black text-braniva-green">Secure Checkout</h1>
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-8 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="font-bold text-braniva-green">Full Name</span>
                  <input name="customerName" className="focus-ring min-h-12 rounded-lg border border-braniva-earth px-4" placeholder="Your full name" />
                  {fieldError("customerName") ? <span className="text-sm font-bold text-red-600">{fieldError("customerName")}</span> : null}
                </label>
                <label className="grid gap-2">
                  <span className="font-bold text-braniva-green">Phone Number</span>
                  <input name="phone" className="focus-ring min-h-12 rounded-lg border border-braniva-earth px-4" placeholder="98XXXXXXXX" />
                  {fieldError("phone") ? <span className="text-sm font-bold text-red-600">{fieldError("phone")}</span> : null}
                </label>
              </div>

              <label className="grid gap-2">
                <span className="font-bold text-braniva-green">Email Address</span>
                <input name="email" type="email" className="focus-ring min-h-12 rounded-lg border border-braniva-earth px-4" placeholder="you@example.com" />
                {fieldError("email") ? <span className="text-sm font-bold text-red-600">{fieldError("email")}</span> : null}
              </label>

              <label className="grid gap-2">
                <span className="font-bold text-braniva-green">Exact Location</span>
                <textarea
                  name="location"
                  rows={4}
                  className="focus-ring rounded-lg border border-braniva-earth px-4 py-3"
                  placeholder="Kindly share your exact location"
                />
                {fieldError("location") ? <span className="text-sm font-bold text-red-600">{fieldError("location")}</span> : null}
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-2">
                  <span className="font-bold text-braniva-green">Product Name</span>
                  <input readOnly value={order.productName} className="min-h-12 rounded-lg border border-braniva-earth bg-braniva-cream px-4 font-bold text-braniva-green" />
                </label>
                <label className="grid gap-2">
                  <span className="font-bold text-braniva-green">Quantity</span>
                  <input readOnly value={order.quantity} className="min-h-12 rounded-lg border border-braniva-earth bg-braniva-cream px-4 font-bold text-braniva-green" />
                </label>
                <label className="grid gap-2">
                  <span className="font-bold text-braniva-green">Price Per Piece</span>
                  <input readOnly value={money(order.pricePerPiece)} className="min-h-12 rounded-lg border border-braniva-earth bg-braniva-cream px-4 font-bold text-braniva-green" />
                </label>
              </div>

              <div className="rounded-lg bg-[#f7fbf4] p-5 ring-1 ring-braniva-earth">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-black text-braniva-green">Total Price</span>
                  <span className="text-3xl font-black text-braniva-green">{money(order.totalPrice)}</span>
                </div>
                <p className="mt-2 text-sm font-bold text-braniva-gold">Payment Method: Cash On Delivery</p>
              </div>

              {error ? <div className="rounded-lg bg-red-50 p-4 text-sm font-bold text-red-700 ring-1 ring-red-200">{error}</div> : null}

              <button
                type="submit"
                disabled={loading}
                className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-braniva-green px-7 py-4 font-black text-white shadow-soft transition hover:bg-braniva-leaf disabled:cursor-not-allowed disabled:opacity-70"
              >
                <PackageCheck size={20} />
                {loading ? "Submitting Order..." : "Order Now"}
              </button>
            </form>
          </section>

          <aside className="self-start rounded-lg bg-braniva-green p-6 text-white shadow-soft">
            <LockKeyhole size={26} className="text-braniva-amber" />
            <h2 className="mt-4 text-2xl font-black">Your order is handled safely.</h2>
            <p className="mt-3 leading-7 text-white/80">
              No online payment is required. After you submit, your order is saved, the Braniva team is notified, and a
              confirmation email is sent to you.
            </p>
            <div className="mt-6 space-y-3 text-sm font-bold">
              <p>Cash on Delivery available</p>
              <p>Free delivery fee</p>
              <p>Sales representative confirmation call</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
