import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

// M01 foundation placeholder. The cinematic homepage is delivered in M03.
export default function Home() {
  return (
    <main className="flex flex-1 items-center py-24">
      <Container>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          {siteConfig.shortName} · {siteConfig.region}
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
          {siteConfig.name}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">
          {siteConfig.description}
        </p>
        <p className="mt-12 text-sm text-muted">
          Our full website is in development.
        </p>
      </Container>
    </main>
  );
}
