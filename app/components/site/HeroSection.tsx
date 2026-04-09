import { HeroParticleCanvas } from "@/app/components/site/HeroParticleCanvas";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black py-24 md:py-32">
      <HeroParticleCanvas />
      <div
        className="pointer-events-none absolute inset-0 z-1 opacity-[0.28]"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.14) 0%, transparent 42%),
            radial-gradient(circle at 80% 72%, rgba(13,148,136,0.12) 0%, transparent 38%)
          `,
        }}
      />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
          BTrust Lab @ IIITM Gwalior
        </h1>
        <p className="mt-3 text-lg text-white/90 md:text-xl">
          ( Blockchain Technology Lab )
        </p>
      </div>
    </section>
  );
}
