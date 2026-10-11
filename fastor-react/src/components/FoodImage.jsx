import { useState } from "react";

export default function FoodImage({ src, alt = "", className = "" }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div className={`food-fallback ${className}`} role={alt ? "img" : undefined} aria-label={alt || undefined}>
        🍽️
      </div>
    );
  }
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} />;
}
