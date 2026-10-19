import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import logo from "../../../public/brand/each-logo.jpeg";

type BrandMarkProps = {
  /** Show the organisation name next to the logo. */
  showName?: boolean;
  /** Logo edge length in pixels. */
  size?: number;
  className?: string;
  onNavigate?: () => void;
};

/**
 * The original EACH logo, unaltered. The supplied file is a JPEG with a white
 * background, so it always sits on a white plate; it is never recoloured,
 * cropped or placed directly on photography.
 */
export function BrandMark({ showName = true, size = 52, className, onNavigate }: BrandMarkProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label={showName ? `${siteConfig.shortName}, ${siteConfig.name}, home` : undefined}
      className={cn("group/brand inline-flex items-center gap-3 rounded-sm", className)}
    >
      <span className="block shrink-0 overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-black/5">
        <Image
          src={logo}
          alt={showName ? "" : `${siteConfig.name} home`}
          width={size}
          height={size}
          sizes={`${size}px`}
          className="block"
          style={{ width: size, height: size }}
        />
      </span>
      {showName ? (
        <span className="flex flex-col leading-tight">
          <span className="font-display text-xl tracking-wide">{siteConfig.shortName}</span>
          {/* Hidden where the desktop navigation needs the room (xl to 2xl). */}
          <span className="hidden text-[0.6875rem] tracking-[0.12em] uppercase opacity-80 sm:block xl:hidden 2xl:block">
            {siteConfig.name}
          </span>
        </span>
      ) : null}
    </Link>
  );
}
