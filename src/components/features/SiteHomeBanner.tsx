import hero from '@/assets/legend-luxury-hero.jpg';
export default function SiteHomeBanner() {
  return <section aria-label="Legend Investors welcome" className="relative isolate min-h-64 overflow-hidden rounded-3xl border border-primary/20 bg-card sm:min-h-80 lg:min-h-96">
    <img src={hero} alt="Gold and black luxury cars in a dramatically lit studio" width={1536} height={864} loading="eager" className="absolute inset-0 h-full w-full object-cover object-center" />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-background/30" aria-hidden="true" />
    <span className="absolute right-4 top-4 rounded-full bg-primary px-4 py-1 text-sm font-semibold tracking-wide text-primary-foreground sm:right-6 sm:top-6">LEGEND</span>
    <div className="relative flex min-h-64 flex-col justify-end p-6 sm:min-h-80 sm:p-8 lg:min-h-96">
      <p className="text-base font-medium text-foreground">Enter</p>
      <h2 className="mt-1 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">A New World</h2>
      <p className="mt-2 max-w-md text-base text-foreground">Your account, products and rewards in one place.</p>
    </div>
  </section>;
}
