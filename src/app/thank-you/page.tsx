import { Suspense } from "react";
import ThankYouContent from "@/components/ThankYouContent";

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="section-shell py-16">Loading order details...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
