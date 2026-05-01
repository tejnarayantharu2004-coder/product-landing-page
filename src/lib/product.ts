export type ProductOption = {
  id: string;
  label: string;
  size: string;
  price: number;
  compareAt?: number;
  badge: string;
  image: string;
  summary: string;
};

export const brandName = "Braniva Oils";

export const productName = "Braniva Rice Bran Oil";

export const productOptions: ProductOption[] = [
  {
    id: "1l-intro",
    label: "1L Intro Offer",
    size: "1 Liter Bottle",
    price: 450,
    compareAt: 500,
    badge: "Limited intro offer",
    image: "/images/braniva-1l-bottle.png",
    summary: "A daily cooking bottle for health-focused homes."
  },
  {
    id: "5l-festival",
    label: "5L Festival Offer",
    size: "5 Liter Jar",
    price: 2300,
    compareAt: 2450,
    badge: "Dashain/Tihar value",
    image: "/images/braniva-5l-jar.png",
    summary: "A value pack for families, dhabas, and small restaurants."
  },
  {
    id: "15l-bulk",
    label: "15L Bulk Pack",
    size: "15 Liter Drum",
    price: 7100,
    badge: "Best for bulk buyers",
    image: "/images/braniva-product-range.png",
    summary: "Commercial quantity for hotels, restaurants, and bulk kitchens."
  }
];

export const galleryImages = [
  { src: "/images/braniva-product-range.png", alt: "Braniva Oils full rice bran oil product range" },
  { src: "/images/braniva-5l-jar.png", alt: "Braniva 5 liter rice bran oil jar" },
  { src: "/images/braniva-premium-bottle.png", alt: "Braniva premium rice bran oil bottle" },
  { src: "/images/braniva-health-bottle.png", alt: "Braniva heart health rice bran oil bottle" },
  { src: "/images/braniva-1l-bottle.png", alt: "Braniva 1 liter rice bran oil bottle" }
];

export const benefits = [
  "Rich in Oryzanol to support healthy cholesterol balance",
  "Vitamin E and natural antioxidants for everyday wellness",
  "Balanced fat composition for smarter daily cooking",
  "High smoke point for frying, sauteing, and Nepali kitchens",
  "100% pure oil sourced from Nepali rice bran",
  "Supports local farmers and Nepal's Go Local movement",
  "Reduces import dependency with local production",
  "Affordable premium quality for homes and businesses"
];

export const testimonials = [
  {
    quote:
      "I switched to Braniva Rice Bran Oil for my family, and I feel much better about what we're eating. It's light, healthy, and truly feels like a better choice for our heart.",
    name: "Household Customer"
  },
  {
    quote:
      "As someone who focuses on fitness and diet, I love that Braniva Oil is rich in antioxidants and good fats. It's a perfect balance of health and taste.",
    name: "Health-Conscious User"
  },
  {
    quote:
      "We use Braniva Oil in our kitchen because of its high smoke point and quality. It's reliable for daily cooking and gives consistent results.",
    name: "Restaurant Owner"
  },
  {
    quote:
      "What I love most is that it's made in Nepal. Supporting local farmers while using a healthy product makes Braniva Oil my first choice.",
    name: "Local Supporter"
  }
];

export const faqs = [
  {
    question: "What is Braniva Rice Bran Oil made from?",
    answer: "Braniva Oil is made from rice bran, the outer layer of rice grains, sourced from local Nepali farmers and rice mills."
  },
  {
    question: "Is rice bran oil healthy for daily cooking?",
    answer:
      "Yes. It is rich in antioxidants, Vitamin E, and Oryzanol, which help support heart health and make it ideal for daily use."
  },
  {
    question: "Can I use Braniva Oil for deep frying?",
    answer: "Absolutely. Braniva Oil has a high smoke point, making it suitable for frying, sauteing, and everyday cooking."
  },
  {
    question: "How is Braniva Oil different from other cooking oils?",
    answer:
      "Braniva Oil is 100% pure, locally sourced, and focused on health, quality, and supporting Nepali farmers."
  },
  {
    question: "Where can I buy Braniva Oil?",
    answer: "You can order directly from this website with Cash on Delivery, and it is also suitable for local retail channels."
  },
  {
    question: "What sizes are available?",
    answer: "Braniva Oil is available in 1L, 5L, and 15L packaging for households and commercial buyers."
  },
  {
    question: "Is Braniva Oil affordable?",
    answer: "Yes. Braniva is priced competitively so healthy, high-quality cooking oil is accessible to more customers."
  }
];

export const reelVideos = [
  {
    title: "Rice Bran Oil Health Benefits",
    url: "https://www.youtube.com/embed/N9jc7p4WFbY",
    label: "Health Benefits"
  },
  {
    title: "Braniva Brand-Style Promotional Ad",
    url: "https://www.youtube.com/embed/GxlPm15XbTM",
    label: "Brand Story"
  },
  {
    title: "Rice Bran Oil Production Process",
    url: "https://www.youtube.com/embed/7Wfq990YRPU",
    label: "Production"
  }
];

export function money(value: number) {
  return `NPR ${value.toLocaleString("en-NP")}`;
}
