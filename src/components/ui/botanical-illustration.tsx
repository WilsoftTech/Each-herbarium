import { cn } from "@/lib/utils";

type BotanicalIllustrationProps = {
  variant: "fern" | "leaf";
  className?: string;
};

const round = (value: number) => Math.round(value * 10) / 10;

/** A frond: a curving rachis with paired pinnae that shorten towards the tip. */
function Fern() {
  const pinnae = Array.from({ length: 16 }, (_, index) => {
    const t = (index + 1) / 17;
    const x = round(100 + 12 * t * t);
    const y = round(390 - 360 * t);
    const length = round(78 * (1 - t) + 10);
    const lift = round(length * 0.45);
    return { x, y, length, lift };
  });

  return (
    <>
      <path d="M100 400 C 98 300, 104 160, 112 24" />
      {pinnae.map(({ x, y, length, lift }) => (
        <g key={y}>
          <path
            d={`M${x} ${y} C ${round(x - length * 0.4)} ${round(y - lift - 6)}, ${round(x - length * 0.8)} ${round(y - lift + 2)}, ${round(x - length)} ${round(y - lift)} C ${round(x - length * 0.7)} ${round(y - lift * 0.4 + 4)}, ${round(x - length * 0.3)} ${round(y + 3)}, ${x} ${y}`}
          />
          <path
            d={`M${x} ${y} C ${round(x + length * 0.4)} ${round(y - lift - 6)}, ${round(x + length * 0.8)} ${round(y - lift + 2)}, ${round(x + length)} ${round(y - lift)} C ${round(x + length * 0.7)} ${round(y - lift * 0.4 + 4)}, ${round(x + length * 0.3)} ${round(y + 3)}, ${x} ${y}`}
          />
        </g>
      ))}
    </>
  );
}

/** A simple leaf with a midrib and alternate secondary veins. */
function Leaf() {
  const veins = Array.from({ length: 9 }, (_, index) => {
    const y = 340 - index * 34;
    const width = round(110 * Math.sin(((index + 1) / 10) * Math.PI));
    return { y, width };
  });

  return (
    <>
      <path d="M100 400 L100 360" />
      <path d="M100 360 C 0 300, 10 120, 100 20 C 190 120, 200 300, 100 360 Z" />
      <path d="M100 360 C 98 260, 99 120, 100 28" />
      {veins.map(({ y, width }, index) => (
        <path
          key={y}
          d={
            index % 2 === 0
              ? `M100 ${y} C ${round(100 - width * 0.4)} ${y - 8}, ${round(100 - width * 0.7)} ${y - 22}, ${round(100 - width * 0.78)} ${y - 40}`
              : `M100 ${y} C ${round(100 + width * 0.4)} ${y - 8}, ${round(100 + width * 0.7)} ${y - 22}, ${round(100 + width * 0.78)} ${y - 40}`
          }
        />
      ))}
    </>
  );
}

/**
 * Original line drawings in the manner of a botanical plate. Decorative only
 * (hidden from assistive technology); they use `currentColor`, so set the
 * colour and opacity with text utilities.
 */
export function BotanicalIllustration({ variant, className }: BotanicalIllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 410"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("h-auto w-full", className)}
    >
      {variant === "fern" ? <Fern /> : <Leaf />}
    </svg>
  );
}
