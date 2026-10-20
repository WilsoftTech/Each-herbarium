import type { MediaAsset } from "@/config/media";
import { cn } from "@/lib/utils";

type PhotoCreditProps = {
  image: MediaAsset;
  className?: string;
};

function CreditPart({ href, children }: { href: string | null; children: string }) {
  if (!href) return <>{children}</>;
  return (
    <a href={href} className="underline-offset-2 hover:underline">
      {children}
    </a>
  );
}

/** Attribution line required by the image licence. Links appear when the source and licence have URLs. */
export function PhotoCredit({ image, className }: PhotoCreditProps) {
  const { author, license, licenseUrl, sourceUrl } = image.credit;

  return (
    <p className={cn("text-xs leading-5 text-muted-foreground", className)}>
      <span className="sr-only">Photo: </span>
      <CreditPart href={sourceUrl}>{author}</CreditPart>
      {", "}
      <CreditPart href={licenseUrl}>{license}</CreditPart>
    </p>
  );
}
