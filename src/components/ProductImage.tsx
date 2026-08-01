import { useEffect, useState } from "react";

type ProductImageProps = {
  src?: string;
  alt: string;
  className?: string;
};

function createFallbackImage(label: string) {
  const safeLabel = label.trim() || "Product";
  const initials = safeLabel
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0ea5e9" />
          <stop offset="100%" stop-color="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="640" height="480" fill="url(#bg)" />
      <circle cx="540" cy="110" r="82" fill="rgba(255,255,255,0.12)" />
      <circle cx="120" cy="380" r="120" fill="rgba(255,255,255,0.08)" />
      <rect x="180" y="118" width="280" height="170" rx="24" fill="rgba(255,255,255,0.18)" />
      <text x="320" y="220" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="74" font-weight="700" fill="#ffffff">${initials}</text>
      <text x="320" y="342" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="600" fill="#e0f2fe">${safeLabel}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function shouldUseFallback(src?: string) {
  if (!src) return true;

  return src.includes("coresg-normal.trae.ai/api/ide/v1/text_to_image");
}

export default function ProductImage({
  src,
  alt,
  className,
}: ProductImageProps) {
  const fallbackSrc = createFallbackImage(alt);
  const [currentSrc, setCurrentSrc] = useState(
    shouldUseFallback(src) ? fallbackSrc : src || fallbackSrc,
  );

  useEffect(() => {
    setCurrentSrc(shouldUseFallback(src) ? fallbackSrc : src || fallbackSrc);
  }, [fallbackSrc, src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => setCurrentSrc(fallbackSrc)}
    />
  );
}
