import { Logo3D } from '@/shared/ui/Logo3D'
import { cn } from '@/lib/utils'

function Tile({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm',
        className
      )}
    />
  )
}

export function LogoShowcase() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Наши преимущества
          </h2>
          <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-primary/10" />
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <Tile className="lg:col-span-4 h-24" />
          <Tile className="lg:col-span-4 h-24" />
          <Tile className="lg:col-span-4 h-24" />

          <Tile className="lg:col-span-3 h-32" />
          <div className="lg:col-span-6 lg:row-span-2 h-[260px] sm:h-[320px] rounded-3xl border border-border/60 bg-card/90 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,195,0,0.25),_transparent_65%)]" />
            <Logo3D className="absolute inset-0 z-10" />
          </div>
          <Tile className="lg:col-span-3 h-32" />
          <Tile className="lg:col-span-3 h-32" />
          <Tile className="lg:col-span-3 h-32" />

          <Tile className="lg:col-span-6 h-24" />
          <Tile className="lg:col-span-6 h-24" />
        </div>
      </div>
    </section>
  )
}

