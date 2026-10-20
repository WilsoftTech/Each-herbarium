import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import logo from "../../../public/brand/each-logo-transparent.png";

type BrandMarkProps = {
  /** Show the organisation name next to the logo. */
  showName?: boolean;
  /** Logo edge length in pixels. */
  size?: number;
  className?: string;
  onNavigate?: () => void;
};

/**
 * The original EACH artwork with its exterior background removed. A light
 * edge shadow keeps the dark portrait and lettering visible over photography
 * and dark surfaces without adding a rectangular plate.
 */
export function BrandMark({ showName = true, size = 52, className, onNavigate }: BrandMarkProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label={showName ? `${siteConfig.shortName}, ${siteConfig.name}, home` : undefined}
      className={cn("group/brand inline-flex items-center gap-3 rounded-sm", className)}
    >
      <span className="block shrink-0">
        <Image
          src={logo}
          alt={showName ? "" : `${siteConfig.name} home`}
          width={size}
          height={size}
          sizes={`${size}px`}
          className="block drop-shadow-[0_0_1px_var(--brand-ivory)]"
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
