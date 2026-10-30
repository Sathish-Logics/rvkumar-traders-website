// Renders an SEO-visible, editorial product card for the homepage material showcase.

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type InteractiveProductCardProps = {
  name: string;
  detail: string;
  image: string;
  alt: string;
  imageClass: string;
};

export function InteractiveProductCard({
  name,
  detail,
  image,
  alt,
  imageClass,
}: InteractiveProductCardProps) {
  return (
    <Link
      href="#quote"
      className="product-card"
      aria-label={`${name}: ${detail}. Add to enquiry`}
    >
      <div className={`product-image ${imageClass}`}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 680px) calc(100vw - 30px), (max-width: 1000px) 50vw, 390px"
        />
      </div>
      <div className="product-content">
        <div>
          <h3>{name}</h3>
          <p>{detail}</p>
        </div>
        <span className="card-link">
          Add to enquiry <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}
