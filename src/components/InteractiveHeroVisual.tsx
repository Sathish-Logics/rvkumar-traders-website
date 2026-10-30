// Renders the static homepage hero image and location label.

import { MapPin } from "lucide-react";
import Image from "next/image";

export function InteractiveHeroVisual() {
  return (
    <div className="hero-visual">
      <div className="hero-image-wrap">
        <Image
          src="/media/rvkumar-lorry-static-v2.jpg"
          alt="RVKumar Traders yellow tipper lorry transporting construction materials near Aruppukottai"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 48vw"
          className="hero-lorry-image"
        />
        <div className="image-overlay" />
      </div>
      <div className="location-card">
        <span className="location-icon">
          <MapPin size={15} />
        </span>
        <div>
          <small>Based in</small>
          <strong>Aruppukottai</strong>
          {/* <p>Aathipatti · 626101</p> */}
        </div>
      </div>
    </div>
  );
}
