import { Suspense } from "react";
import CheckoutForm from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="section-shell py-16">Loading checkout...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
