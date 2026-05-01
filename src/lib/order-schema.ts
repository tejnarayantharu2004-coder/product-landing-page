import { z } from "zod";

export const orderInputSchema = z.object({
  customerName: z.string().trim().min(1, "Full name is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  email: z.string().trim().email("Please enter a valid email address"),
  location: z.string().trim().min(1, "Exact location is required"),
  productName: z.string().trim().min(1, "Product name is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  pricePerPiece: z.coerce.number().positive("Price per piece must be valid"),
  totalPrice: z.coerce.number().positive("Total price must be valid")
});

export type OrderInput = z.infer<typeof orderInputSchema>;

export type OrderRecord = OrderInput & {
  orderId: string;
  dateTime: string;
  paymentMethod: "Cash On Delivery";
  orderStatus: "New Order";
  notes: "";
};

export function createOrderRecord(input: OrderInput): OrderRecord {
  return {
    ...input,
    orderId: `BRN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    dateTime: new Intl.DateTimeFormat("en-NP", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kathmandu"
    }).format(new Date()),
    paymentMethod: "Cash On Delivery",
    orderStatus: "New Order",
    notes: ""
  };
}
