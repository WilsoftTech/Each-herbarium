import Image from "next/image";
import { PhotoCredit } from "@/components/ui/photo-credit";
import type { TeamMember } from "../schema";

/** Profiles of one group: photograph (when supplied), name, role and a short biography. */
export function TeamList({ members }: { members: readonly TeamMember[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <li key={member.slug} data-reveal>
          <article>
            {member.photo ? (
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted">
                  <Image
                    src={member.photo.src}
                    alt={member.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-2">
                  <PhotoCredit image={member.photo} />
                </figcaption>
              </figure>
            ) : null}
            <h3 className="mt-6 font-display text-heading">{member.name}</h3>
            <p className="mt-1 text-eyebrow font-medium text-primary uppercase">
              {member.roleTitle}
            </p>
            <div className="mt-4 space-y-3 leading-7 text-pretty text-muted-foreground">
              {member.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
