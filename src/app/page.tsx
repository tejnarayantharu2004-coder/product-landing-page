"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Leaf,
  PackageCheck,
  PhoneCall,
  ShieldCheck,
  ShoppingBag,
  Truck
} from "lucide-react";
import {
  benefits,
  brandName,
  faqs,
  galleryImages,
  money,
  productName,
  productOptions,
  reelVideos,
  testimonials
} from "@/lib/product";

function checkoutHref(product: string, quantity: number, price: number) {
  const params = new URLSearchParams({
    productName: product,
    quantity: String(quantity),
    pricePerPiece: String(price),
    totalPrice: String(quantity * price)
  });
  return `/checkout?${params.toString()}`;
}

function CTAButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-braniva-green px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-braniva-leaf"
    >
      <ShoppingBag size={18} />
      {children}
    </Link>
  );
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(productOptions[0].id);
  const [quantity, setQuantity] = useState(1);

  const selectedProduct = productOptions.find((item) => item.id === selectedProductId) || productOptions[0];
  const selectedProductName = `${productName} - ${selectedProduct.size}`;
  const href = checkoutHref(selectedProductName, quantity, selectedProduct.price);
  const heroHref = checkoutHref(`${productName} - ${productOptions[0].size}`, 1, productOptions[0].price);
  const total = useMemo(() => selectedProduct.price * quantity, [selectedProduct.price, quantity]);

  return (
    <main>
      <header className="section-shell flex items-center justify-between py-5">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/braniva-logo.png" alt="Braniva Oils logo" width={132} height={82} className="h-16 w-auto object-contain sm:h-20" priority />
          <span className="text-lg font-black text-braniva-green">{brandName}</span>
        </Link>
        <Link href="/checkout" className="hidden rounded-full border border-braniva-green/20 px-5 py-2 text-sm font-bold text-braniva-green sm:inline-flex">
          Order Now
        </Link>
      </header>

      <section className="section-shell grid min-h-[calc(100vh-88px)] items-center gap-10 pb-12 pt-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-braniva-green shadow-sm ring-1 ring-braniva-gold/20">
            <Leaf size={16} className="text-braniva-gold" />
            Pure. Local. Heart Healthy.
          </div>
          <h1 className="font-[var(--font-playfair)] text-5xl font-black leading-tight text-braniva-green sm:text-6xl lg:text-7xl">
            One Brand. Every Size. Pure Every Time.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#445446]">
            Whether you are cooking for your family or running a restaurant kitchen, Braniva Rice Bran Oil delivers 100% pure,
            locally sourced Nepali rice bran oil in every drop.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <CTAButton href={heroHref}>Purchase Now</CTAButton>
            <CTAButton href={heroHref}>Order Now</CTAButton>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Cash on Delivery", ShieldCheck],
              ["Free Delivery", Truck],
              ["Fast Support", PhoneCall]
            ].map(([label, Icon]) => (
              <div key={String(label)} className="flex items-center gap-2 rounded-lg bg-white/80 px-4 py-3 text-sm font-bold text-braniva-green shadow-sm">
                <Icon size={18} className="text-braniva-gold" />
                {String(label)}
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex min-h-[470px] items-center justify-center">
          <div className="absolute inset-x-8 bottom-10 h-32 rounded-[50%] bg-braniva-gold/20 blur-2xl" />
          <Image
            src="/images/braniva-product-range.png"
            alt="Braniva Rice Bran Oil product range"
            width={620}
            height={620}
            className="relative z-10 h-auto max-h-[620px] w-full object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </section>

      <section id="shop" className="bg-white py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <div className="relative flex aspect-square max-h-[610px] items-center justify-center overflow-hidden rounded-lg bg-braniva-cream ring-1 ring-braniva-earth">
              <Image
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                width={620}
                height={620}
                className="h-full w-full object-contain p-8"
              />
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => setSelectedImage((selectedImage + galleryImages.length - 1) % galleryImages.length)}
                className="focus-ring absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-braniva-green shadow"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => setSelectedImage((selectedImage + 1) % galleryImages.length)}
                className="focus-ring absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-braniva-green shadow"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-3">
              {galleryImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`focus-ring aspect-square rounded-lg bg-white p-2 ring-2 ${index === selectedImage ? "ring-braniva-gold" : "ring-braniva-earth"}`}
                >
                  <Image src={image.src} alt={image.alt} width={120} height={120} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          <div className="self-center">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-braniva-gold">{brandName}</p>
            <h2 className="mt-3 font-[var(--font-playfair)] text-4xl font-black text-braniva-green">{productName}</h2>
            <p className="mt-4 text-base leading-7 text-[#4f5f51]">
              Choose your size. Choose health. Choose Braniva. Made from Nepali rice bran and built for everyday homes,
              restaurants, hotels, and bulk buyers.
            </p>

            <div className="mt-6 grid gap-3">
              {productOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedProductId(option.id)}
                  className={`focus-ring rounded-lg border p-4 text-left transition ${
                    selectedProductId === option.id ? "border-braniva-gold bg-braniva-cream" : "border-braniva-earth bg-white hover:border-braniva-gold/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black text-braniva-green">{option.label}</p>
                      <p className="mt-1 text-sm text-[#5f695d]">{option.summary}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-braniva-green">{money(option.price)}</p>
                      {option.compareAt ? <p className="text-sm text-[#7c806f] line-through">{money(option.compareAt)}</p> : null}
                    </div>
                  </div>
                  <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-braniva-leaf ring-1 ring-braniva-earth">
                    {option.badge}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-[#f7fbf4] p-5 ring-1 ring-braniva-earth">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-braniva-green">Quantity</span>
                <div className="flex items-center rounded-full bg-white p-1 ring-1 ring-braniva-earth">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid h-9 w-9 place-items-center rounded-full text-xl font-black text-braniva-green">
                    -
                  </button>
                  <span className="grid h-9 min-w-12 place-items-center font-black">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(quantity + 1)} className="grid h-9 w-9 place-items-center rounded-full text-xl font-black text-braniva-green">
                    +
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-sm font-bold text-[#687463]">Live Total</p>
                  <p className="text-3xl font-black text-braniva-green">{money(total)}</p>
                </div>
                <p className="text-sm font-bold text-braniva-gold">Free delivery</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <CTAButton href={href}>Purchase Now</CTAButton>
              <CTAButton href={href}>Buy Now</CTAButton>
            </div>
          </div>
        </div>
      </section>

      {reelVideos.length > 0 ? (
        <section className="py-16">
          <div className="section-shell">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-braniva-gold">Watch Braniva</p>
              <h2 className="mt-3 font-[var(--font-playfair)] text-4xl font-black text-braniva-green">Health, purity, and production in motion.</h2>
            </div>
            <div className="mt-9 grid gap-8 md:grid-cols-3">
              {reelVideos.map((video) => (
                <div key={video.url} className="mx-auto w-full max-w-[320px]">
                  <div className="rounded-[2.5rem] bg-[#111714] p-3 shadow-soft">
                    <div className="overflow-hidden rounded-[2rem] bg-black">
                      <iframe
                        title={video.title}
                        src={video.url}
                        className="aspect-[9/16] w-full"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-center text-sm font-black uppercase tracking-[0.16em] text-braniva-green">{video.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-16">
        <div className="section-shell">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-braniva-gold">Why Buy Braniva</p>
              <h2 className="mt-3 font-[var(--font-playfair)] text-4xl font-black text-braniva-green">Better oil for better everyday cooking.</h2>
            </div>
            <CTAButton href={href}>Order Now</CTAButton>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const icons = [HeartPulse, BadgeCheck, PackageCheck, Leaf];
              const Icon = icons[index % icons.length];
              return (
                <div key={benefit} className="rounded-lg border border-braniva-earth bg-[#fffdf7] p-5">
                  <Icon size={24} className="text-braniva-gold" />
                  <p className="mt-4 font-bold leading-6 text-braniva-green">{benefit}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-shell">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-braniva-gold">Customer Trust</p>
          <h2 className="mt-3 font-[var(--font-playfair)] text-4xl font-black text-braniva-green">Loved by homes and commercial kitchens.</h2>
          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.name} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-braniva-earth">
                <blockquote className="text-lg leading-8 text-[#405044]">"{testimonial.quote}"</blockquote>
                <figcaption className="mt-5 font-black text-braniva-green">{testimonial.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="section-shell max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-braniva-gold">FAQ</p>
          <h2 className="mt-3 font-[var(--font-playfair)] text-4xl font-black text-braniva-green">Frequently asked questions.</h2>
          <div className="mt-8 divide-y divide-braniva-earth rounded-lg border border-braniva-earth bg-[#fffdf7]">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="group p-5" open={index === 0}>
                <summary className="cursor-pointer list-none text-lg font-black text-braniva-green">
                  {faq.question}
                </summary>
                <p className="mt-3 leading-7 text-[#566154]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="rounded-lg bg-braniva-green px-6 py-12 text-center text-white sm:px-10">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-braniva-amber">Cash on Delivery Available</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-[var(--font-playfair)] text-4xl font-black">Choose health. Choose local. Choose Braniva today.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">Order now and our sales representative will call you soon to confirm your order.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href={href} className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-braniva-gold px-6 py-3 text-sm font-black text-braniva-green">
              Purchase Now
            </Link>
            <Link href={href} className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-black text-braniva-green">
              Buy Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
