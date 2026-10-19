import type { MediaAsset } from "@/config/media";
import { cn } from "@/lib/utils";

type PhotoCreditProps = {
  image: MediaAsset;
  className?: string;
};

/** Attribution line required by the image licence. */
export function PhotoCredit({ image, className }: PhotoCreditProps) {
  const { author, license, licenseUrl, sourceUrl } = image.credit;

  return (
    <p className={cn("text-xs leading-5 text-muted-foreground", className)}>
      <span className="sr-only">Photo: </span>
      <a href={sourceUrl} className="underline-offset-2 hover:underline">
        {author}
      </a>
      {", "}
      <a href={licenseUrl} className="underline-offset-2 hover:underline">
        {license}
      </a>
    </p>
  );
}
