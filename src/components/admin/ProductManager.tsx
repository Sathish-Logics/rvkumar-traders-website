// Lets the owner create products and update catalogue visibility and availability.
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  description: string;
  unit: string;
  imageUrl: string;
  isPublished: boolean;
  isAvailable: boolean;
};
export function ProductManager({ products }: { products: Product[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function patch(id: string, body: object) {
    const response = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setMessage(response.ok ? "Product updated" : "Unable to update product");
    if (response.ok) router.refresh();
  }
  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form);
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, isPublished: true, isAvailable: true }),
    });
    setMessage(response.ok ? "Product created" : "Unable to create product");
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }
  return (
    <>
      <form className="admin-editor-panel" onSubmit={create}>
        <h2>Add product</h2>
        <div className="admin-control-grid">
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Slug
            <input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
          </label>
          <label>
            Brand
            <input name="brand" />
          </label>
          <label>
            Unit
            <input name="unit" required />
          </label>
          <label className="admin-field-wide">
            Description
            <textarea name="description" required minLength={5} />
          </label>
          <label className="admin-field-wide">
            Image path
            <input
              name="imageUrl"
              required
              placeholder="/images/products/example.webp"
            />
          </label>
        </div>
        <button type="submit">Add product</button>
        <span>{message}</span>
      </form>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th>Unit</th>
              <th>Published</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <b>{product.name}</b>
                  <small>{product.slug}</small>
                </td>
                <td>{product.brand ?? "—"}</td>
                <td>{product.unit}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={product.isPublished}
                    onChange={(event) =>
                      patch(product.id, { isPublished: event.target.checked })
                    }
                    aria-label={`Publish ${product.name}`}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={product.isAvailable}
                    onChange={(event) =>
                      patch(product.id, { isAvailable: event.target.checked })
                    }
                    aria-label={`Make ${product.name} available`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
