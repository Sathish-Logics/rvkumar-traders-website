// Renders one reusable product catalogue card with image and enquiry navigation.
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  brand?: string | null;
};

export function ProductCard({
  slug,
  name,
  description,
  imageUrl,
  brand,
}: ProductCardProps) {
  return (
    <article className="catalogue-card">
      <Link href={`/products/${slug}`} className="catalogue-card-image">
        <Image
          src={imageUrl}
          alt={`${name} available for quotation enquiry`}
          fill
          sizes="(max-width: 700px) 100vw, 33vw"
        />
      </Link>
      <div className="catalogue-card-copy">
        {brand ? <small>{brand}</small> : null}
        <h2>
          <Link href={`/products/${slug}`}>{name}</Link>
        </h2>
        <p>{description}</p>
        <Link href={`/enquiry?product=${slug}`} className="button">
          Request quotation
        </Link>
      </div>
    </article>
  );
}
