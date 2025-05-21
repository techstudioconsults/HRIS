import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC, HtmlHTMLAttributes, ReactNode } from "react";

interface BannerProperties extends HtmlHTMLAttributes<HTMLDivElement> {
  tagTitle?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  image?: string;
  asChild?: boolean;
}

export const ReusableBanner: FC<BannerProperties> = ({
  title,
  tagTitle,
  description,
  action,
  image,
  asChild = false,
  children,
  className,
}) => {
  return (
    <section
      className={cn(
        `bg-primary/10 relative flex flex-col-reverse items-center justify-between gap-4 rounded-lg px-4 py-8`, // Mobile padding
        `md:px-8 md:py-10`, // Tablet padding
        `lg:flex-row lg:px-15 lg:py-13`, // Desktop layout (matches your original)
        className,
      )}
    >
      {/* Content - remains unchanged from your original */}
      {asChild ? (
        children
      ) : (
        <div className={`w-full lg:pr-[40%]`}>
          {/* Full width on mobile, original padding on desktop */}
          <Badge variant={`default`} className={`bg-accent rounded-md px-[12px] py-[6px]`}>
            {tagTitle}
          </Badge>
          <h1 className="mt-4 text-2xl md:text-3xl lg:text-4xl">{title}</h1> {/* Responsive text */}
          <p className={`text-high-grey-II my-[22px] text-lg font-[300] md:text-xl lg:text-2xl`}>{description}</p>{" "}
          {/* Responsive text */}
          {action}
        </div>
      )}

      {/* Image - adjusted for mobile but preserves desktop layout */}
      <div
        className={cn(
          `relative mb-4 hidden h-48 w-full lg:block`, // Mobile styles
          `md:mb-6 md:h-64`, // Tablet
          `lg:absolute lg:right-0 lg:bottom-0 lg:mb-0 lg:h-[447px] lg:w-[557px]`, // Exactly your original desktop layout
        )}
      >
        <Image
          src={image || ""}
          alt="wheel"
          fill
          className="object-contain"
          sizes="(max-width: 1023px) 100vw, 557px" // Optimized image loading
        />
      </div>
    </section>
  );
};
