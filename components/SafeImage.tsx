"use client";

import Image from "next/image";
import { useState } from "react";
import { Home } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackSrc?: string;
};

// Fallback placeholder image (local or reliable CDN)
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Cpath d='M200 120L160 180H240L200 120Z' fill='%23d1d5db'/%3E%3Crect x='140' y='180' width='120' height='80' fill='%23d1d5db'/%3E%3Cpath d='M170 210h60v10h-60z' fill='%239ca3af'/%3E%3Cpath d='M170 225h60v5h-60z' fill='%239ca3af'/%3E%3Cpath d='M170 235h40v5h-40z' fill='%239ca3af'/%3E%3C/svg%3E";

export function SafeImage({ 
  src, 
  alt, 
  fill = false, 
  width, 
  height, 
  className = "", 
  sizes,
  priority = false,
  fallbackSrc = FALLBACK_IMAGE 
}: Props) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.warn(`Image failed to load: ${src} - using fallback`);
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  const imageProps = {
    src: imgSrc,
    alt,
    className,
    sizes,
    priority,
    onError: handleError,
  };

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        <Image
          {...imageProps}
          fill
          style={{ objectFit: "cover" }}
        />
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
            <Home className="w-8 h-8 text-neutral-400" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Image
        {...imageProps}
        width={width}
        height={height}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
          <Home className="w-8 h-8 text-neutral-400" />
        </div>
      )}
    </div>
  );
}
