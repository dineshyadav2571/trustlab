export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 0%, transparent 35%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='12' r='1.2' fill='%23ffffff' fill-opacity='0.5'/%3E%3Ccircle cx='52' cy='8' r='1' fill='%23ffffff' fill-opacity='0.4'/%3E%3Ccircle cx='30' cy='35' r='1' fill='%23ffffff' fill-opacity='0.45'/%3E%3Ccircle cx='45' cy='48' r='1.1' fill='%23ffffff' fill-opacity='0.35'/%3E%3Cline x1='8' y1='12' x2='30' y2='35' stroke='%23ffffff' stroke-opacity='0.15' stroke-width='0.5'/%3E%3Cline x1='30' y1='35' x2='52' y2='8' stroke='%23ffffff' stroke-opacity='0.12' stroke-width='0.5'/%3E%3Cline x1='30' y1='35' x2='45' y2='48' stroke='%23ffffff' stroke-opacity='0.12' stroke-width='0.5'/%3E%3C/svg%3E")
          `,
          backgroundSize: "auto, auto, 60px 60px",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center">
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
