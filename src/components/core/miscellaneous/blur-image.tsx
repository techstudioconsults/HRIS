"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, type ComponentProps } from "react";

export function BlurImage(properties: ComponentProps<typeof Image>) {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      {...properties}
      alt={properties.alt}
      className={cn(
        "duration-700 ease-in-out",
        isLoading ? "scale-105 blur-lg" : "blur-0 scale-100",
        properties.className,
      )}
      onLoad={() => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }}
    />
  );
}
