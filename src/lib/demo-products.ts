import type { Product } from "@/components/ProductCard";
import capAdisa from "@/assets/cap-adisa.jpg";
import capIshola from "@/assets/cap-ishola.jpg";
import capAkanni from "@/assets/cap-akanni.jpg";
import capOtunba from "@/assets/cap-otunba.jpg";

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
    images: [capAdisa],
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
    id: "demo-ishola-burgundy",
    name: "Ishola Burgundy Reserve",
    price: 38000,
    images: [capIshola],
    category: "Cap",
    style: "Ishola",
    shortDescription: "Soft-band Fìlá in rich burgundy with a subtle bronze motif.",
    description:
      "Refined and endlessly wearable, the Ishola Burgundy Reserve pairs an elegant soft-band silhouette with a rich burgundy fabric and subtle bronze motif — the everyday choice for the discerning gentleman.",
    stock: 8,
    status: "active",
    featured: true,
  },
  {
    id: "demo-akanni-ivory",
    name: "Akanni Ivory Aso-Oke",
    price: 52000,
    images: [capAkanni],
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
    id: "demo-otunba-emerald",
    name: "Otunba Emerald Net",
    price: 60000,
    salePrice: 54000,
    images: [capOtunba],
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
    id: "demo-adisa-onyx",
    name: "Adisa Onyx Black",
    price: 42000,
    images: [capAdisa],
    category: "Cap",
    style: "Adisa",
    shortDescription: "Timeless hard-band Fìlá in onyx black with tonal stitching.",
    stock: 10,
    status: "active",
  },
  {
    id: "demo-ishola-champagne",
    name: "Ishola Champagne",
    price: 40000,
    images: [capIshola],
    category: "Cap",
    style: "Ishola",
    shortDescription: "Soft-band Fìlá in warm champagne — refined and light.",
    stock: 7,
    status: "active",
  },
  {
    id: "demo-akanni-obsidian",
    name: "Akanni Obsidian",
    price: 48000,
    images: [capAkanni],
    category: "Cap",
    style: "Akanni",
    shortDescription: "Modern no-band Fìlá in matte obsidian with a sculptural drape.",
    stock: 5,
    status: "active",
  },
  {
    id: "demo-otunba-royal-gold",
    name: "Otunba Royal Gold",
    price: 65000,
    images: [capOtunba],
    category: "Cap",
    style: "Otunba",
    shortDescription: "Hand-netted Fìlá in royal gold — the ceremonial edition.",
    stock: 3,
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
