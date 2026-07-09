import type { Product } from "@/components/ProductCard";
import productAdisaNavy from "@/assets/product-adisa-navy.jpg";
import productAdisaOnyx from "@/assets/product-adisa-onyx.jpg";
import productAdisaCrimson from "@/assets/product-adisa-crimson.jpg";
import productAdisaPurple from "@/assets/product-adisa-purple.jpg";
import productAdisaTeal from "@/assets/product-adisa-teal.jpg";
import productIsholaBurgundy from "@/assets/product-ishola-burgundy.jpg";
import productIsholaChampagne from "@/assets/product-ishola-champagne.jpg";
import productIsholaBrown from "@/assets/product-ishola-brown.jpg";
import productAkanniIvory from "@/assets/product-akanni-ivory.jpg";
import productAkanniObsidian from "@/assets/product-akanni-obsidian.jpg";
import productAkanniSky from "@/assets/product-akanni-sky.jpg";
import productOtunbaEmerald from "@/assets/product-otunba-emerald.jpg";
import productOtunbaGold from "@/assets/product-otunba-gold.jpg";
import productOtunbaSilver from "@/assets/product-otunba-silver.jpg";

/**
 * Static demo products used as a fallback while the backend API is under
 * development. These are shown when the API returns an empty array, null,
 * undefined, or fails to load — so the store is never empty.
 */
export const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-adisa-royal-navy",
    name: "Adisa Royal Navy",
    price: 45000,
    salePrice: 39000,
    images: [productAdisaNavy],
    category: "Cap",
    style: "Adisa",
    shortDescription: "Structured hard-band Fìlá in deep velvet navy with gold embroidery.",
    description:
      "The Adisa Royal Navy is our signature statement piece — a structured hard-band Fìlá crafted from premium velvet with hand-stitched gold embroidery. Made for the man who wears his heritage with quiet authority.",
    stock: 12,
    status: "active",
    featured: true,
  },
  {
    id: "demo-otunba-emerald",
    name: "Otunba Emerald Net",
    price: 60000,
    salePrice: 54000,
    images: [productOtunbaEmerald],
    category: "Cap",
    style: "Otunba",
    shortDescription: "Hand-netted Fìlá in emerald green with intricate gold thread lattice.",
    description:
      "For the connoisseur — the Otunba Emerald Net is entirely hand-netted by master artisans, with intricate gold thread woven through a rich emerald lattice. Weeks of craftsmanship in every piece.",
    stock: 4,
    status: "active",
    featured: true,
  },
  {
    id: "demo-ishola-burgundy",
    name: "Ishola Burgundy Reserve",
    price: 38000,
    images: [productIsholaBurgundy],
    category: "Cap",
    style: "Ishola",
    shortDescription: "Soft-band Fìlá in rich burgundy aso-oke with a subtle bronze motif.",
    description:
      "Refined and endlessly wearable, the Ishola Burgundy Reserve pairs an elegant soft-band silhouette with rich burgundy aso-oke and a subtle bronze motif — the everyday choice for the discerning gentleman.",
    stock: 8,
    status: "active",
    featured: true,
  },
  {
    id: "demo-adisa-royal-purple",
    name: "Adisa Royal Purple",
    price: 55000,
    images: [productAdisaPurple],
    category: "Cap",
    style: "Adisa",
    shortDescription: "Regal purple velvet Fìlá with gold crown embroidery.",
    description:
      "Fit for royalty — the Adisa Royal Purple is cut from deep purple velvet and finished with hand-embroidered gold crowns around the band. A ceremonial centrepiece.",
    stock: 5,
    status: "active",
    featured: true,
  },
  {
    id: "demo-akanni-ivory",
    name: "Akanni Ivory Aso-Oke",
    price: 52000,
    images: [productAkanniIvory],
    category: "Cap",
    style: "Akanni",
    shortDescription: "No-band contemporary Fìlá in ivory aso-oke with fine gold stripes.",
    description:
      "The Akanni Ivory is a contemporary reimagining of the classic no-band Fìlá — woven from premium ivory aso-oke with fine gold stripes for a modern, sculptural silhouette.",
    stock: 6,
    status: "active",
    featured: true,
  },
  {
    id: "demo-otunba-royal-gold",
    name: "Otunba Royal Gold",
    price: 65000,
    images: [productOtunbaGold],
    category: "Cap",
    style: "Otunba",
    shortDescription: "Hand-netted Fìlá in royal gold — the ceremonial edition.",
    description:
      "The Otunba Royal Gold is hand-netted in shimmering gold thread — the ultimate ceremonial Fìlá for weddings, chieftaincy and milestone celebrations.",
    stock: 3,
    status: "active",
    featured: true,
  },
  {
    id: "demo-adisa-crimson",
    name: "Adisa Crimson Regalia",
    price: 47000,
    salePrice: 42000,
    images: [productAdisaCrimson],
    category: "Cap",
    style: "Adisa",
    shortDescription: "Crimson velvet hard-band Fìlá with silver embroidered band.",
    description:
      "Bold and ceremonial — the Adisa Crimson Regalia pairs rich crimson velvet with an intricately embroidered silver band. Made to be noticed.",
    stock: 9,
    status: "active",
    featured: true,
  },
  {
    id: "demo-ishola-champagne",
    name: "Ishola Champagne",
    price: 40000,
    images: [productIsholaChampagne],
    category: "Cap",
    style: "Ishola",
    shortDescription: "Soft-band Fìlá in warm champagne silk — refined and light.",
    description:
      "The Ishola Champagne drapes beautifully in warm champagne silk — light, refined, and effortlessly elegant for both traditional and modern attire.",
    stock: 7,
    status: "active",
    featured: true,
  },
  {
    id: "demo-adisa-onyx",
    name: "Adisa Onyx Black",
    price: 42000,
    images: [productAdisaOnyx],
    category: "Cap",
    style: "Adisa",
    shortDescription: "Timeless hard-band Fìlá in onyx black velvet with tonal stitching.",
    description:
      "A timeless staple — the Adisa Onyx Black in deep velvet with tonal geometric stitching. Pairs with everything, elevates anything.",
    stock: 10,
    status: "active",
  },
  {
    id: "demo-akanni-obsidian",
    name: "Akanni Obsidian",
    price: 48000,
    images: [productAkanniObsidian],
    category: "Cap",
    style: "Akanni",
    shortDescription: "Modern no-band Fìlá in matte obsidian with a sculptural drape.",
    description:
      "Matte obsidian aso-oke with a sculptural drape — the Akanni Obsidian is contemporary Yoruba elegance at its most minimal.",
    stock: 5,
    status: "active",
  },
  {
    id: "demo-akanni-sky",
    name: "Akanni Sky Stripe",
    price: 36000,
    images: [productAkanniSky],
    category: "Cap",
    style: "Akanni",
    shortDescription: "Fresh white and sky-blue striped aso-oke Fìlá.",
    description:
      "Crisp and cool — the Akanni Sky Stripe is woven in white and sky-blue aso-oke, perfect for daytime celebrations and owambe in the sun.",
    stock: 11,
    status: "active",
  },
  {
    id: "demo-ishola-brown",
    name: "Ishola Heritage Brown",
    price: 39000,
    images: [productIsholaBrown],
    category: "Cap",
    style: "Ishola",
    shortDescription: "Chocolate brown aso-oke Fìlá with cream geometric weave.",
    description:
      "Earthy and dignified — the Ishola Heritage Brown is woven in chocolate aso-oke with a cream geometric pattern that honours the classics.",
    stock: 8,
    status: "active",
  },
  {
    id: "demo-otunba-silver",
    name: "Otunba Silver Wedding",
    price: 58000,
    salePrice: 52000,
    images: [productOtunbaSilver],
    category: "Cap",
    style: "Otunba",
    shortDescription: "Hand-netted ivory and silver Fìlá — the wedding edition.",
    description:
      "Made for the big day — the Otunba Silver Wedding is hand-netted in silver-white lattice over an ivory base. The groom's crown.",
    stock: 4,
    status: "active",
  },
  {
    id: "demo-adisa-teal",
    name: "Adisa Teal Damask",
    price: 44000,
    images: [productAdisaTeal],
    category: "Cap",
    style: "Adisa",
    shortDescription: "Teal damask Fìlá with tonal floral jacquard pattern.",
    description:
      "Quietly luxurious — the Adisa Teal Damask features a tonal floral jacquard in deep teal, structured to hold its regal fold all day.",
    stock: 6,
    status: "active",
  },
];

/**
 * Returns API products if the list is non-empty; otherwise returns the demo
 * fallback list so the UI is never empty. Optionally filters demo products
 * by style / category / query so filters still feel responsive.
 */
export function withDemoFallback(
  apiProducts: Product[] | null | undefined,
  filters: { style?: string; category?: string; q?: string } = {},
): Product[] {
  if (apiProducts && apiProducts.length > 0) return apiProducts;
  const q = filters.q?.toLowerCase().trim();
  return DEMO_PRODUCTS.filter((p) => {
    if (filters.style && p.style !== filters.style) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (q && !(`${p.name} ${p.shortDescription ?? ""}`.toLowerCase().includes(q))) return false;
    return true;
  });
}
