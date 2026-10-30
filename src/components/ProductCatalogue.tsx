// Adds an accessible client-side material filter to the database-backed catalogue.
"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";

type CatalogueProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  brand?: string | null;
};

const categories = ["All", "Cement", "Sand", "Steel", "Bricks", "Other"] as const;

function categoryFor(name: string) {
  const value = name.toLowerCase();
  if (value.includes("cement")) return "Cement";
  if (value.includes("sand")) return "Sand";
  if (value.includes("steel") || value.includes("tmt")) return "Steel";
  if (value.includes("brick")) return "Bricks";
  return "Other";
}

export function ProductCatalogue({ products }: { products: CatalogueProduct[] }) {
  const [selected, setSelected] = useState<(typeof categories)[number]>("All");
  const filtered = useMemo(
    () =>
      selected === "All"
        ? products
        : products.filter((product) => categoryFor(product.name) === selected),
    [products, selected],
  );

  return (
    <section aria-labelledby="catalogue-heading">
      <div className="catalogue-toolbar">
        <h2 id="catalogue-heading">All materials</h2>
        <div className="catalogue-filters" aria-label="Filter materials">
          {categories.map((category) => (
            <button
              className={selected === category ? "is-active" : ""}
              key={category}
              onClick={() => setSelected(category)}
              type="button"
              aria-pressed={selected === category}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="catalogue-grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="catalogue-empty">No published materials in this category.</p>
      ) : null}
    </section>
  );
}
