"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Home } from "lucide-react";
import { money } from "@/lib/product";

export default function ThankYouContent() {
  const params = useSearchParams();
  const productName = params.get("productName") || "Braniva Rice Bran Oil";
  const quantity = params.get("quantity") || "1";
  const totalPrice = Number(params.get("totalPrice") || "0");
  const orderId = params.get("orderId");

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-2xl rounded-lg bg-white p-6 text-center shadow-soft ring-1 ring-braniva-earth sm:p-10">
        <Image src="/images/braniva-logo.png" alt="Braniva Oils logo" width={150} height={94} className="mx-auto h-24 w-auto object-contain" />
        <CheckCircle2 size={56} className="mx-auto mt-6 text-braniva-leaf" />
        <h1 className="mt-5 font-[var(--font-playfair)] text-4xl font-black text-braniva-green">Thank you for your order!</h1>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-[#566154]">Our sales representative will call you soon to confirm your order.</p>

        <div className="mt-8 rounded-lg bg-braniva-cream p-5 text-left ring-1 ring-braniva-earth">
          {orderId ? (
            <div className="flex justify-between gap-4 border-b border-braniva-earth py-3">
              <span className="font-bold text-[#647061]">Order ID</span>
              <span className="text-right font-black text-braniva-green">{orderId}</span>
            </div>
          ) : null}
          <div className="flex justify-between gap-4 border-b border-braniva-earth py-3">
            <span className="font-bold text-[#647061]">Product ordered</span>
            <span className="text-right font-black text-braniva-green">{productName}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-braniva-earth py-3">
            <span className="font-bold text-[#647061]">Quantity</span>
            <span className="font-black text-braniva-green">{quantity}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-braniva-earth py-3">
            <span className="font-bold text-[#647061]">Total price</span>
            <span className="font-black text-braniva-green">{money(totalPrice)}</span>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <span className="font-bold text-[#647061]">Payment method</span>
            <span className="font-black text-braniva-green">Cash On Delivery</span>
          </div>
        </div>

        <Link
          href="/"
          className="focus-ring mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-braniva-green px-7 py-3 font-black text-white shadow-soft hover:bg-braniva-leaf"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </section>
    </main>
  );
}
