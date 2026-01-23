import Image from 'next/image'
import { Logo3D } from '@/shared/ui/Logo3D'
import { cn } from '@/lib/utils'
import type { LogoShowcaseProps } from '@/shared/api/pages/main/types'

const htmlTextClassName =
  'text-sm md:text-base leading-snug text-foreground/90 [&_strong]:font-bold [&_strong]:text-primary [&_em]:not-italic [&_em]:font-light [&_br]:block'

function Tile({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_25px_rgba(255,195,0,0.35)] hover:shadow-primary/40',
        className
      )}
    >
      {children}
    </div>
  )
}

export function LogoShowcase({ blok }: LogoShowcaseProps) {
  if (!blok) return null

  const { tri_verhnie_vkladki, czentralnye_vkladki, dve_nizhnie_vkladki } = blok

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center flex-col justify-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            {blok.zagolovok}
          </h2>
          <div className="mt-3 h-1 w-52 rounded-full bg-gradient-to-r from-primary to-primary/10" />
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <Tile className="relative lg:col-span-4 h-24 px-5 py-4 overflow-hidden">
            <div
              className={htmlTextClassName}
              dangerouslySetInnerHTML={{
                __html: tri_verhnie_vkladki.levaya_gruppa.tekst,
              }}
            />
            <Image
              src={tri_verhnie_vkladki.levaya_gruppa.izobrazhenie}
              alt=""
              width={256}
              height={256}
              className="absolute -bottom-6 -right-6 h-24 w-24 opacity-70"
            />
          </Tile>
          <Tile className="relative lg:col-span-4 h-24 px-5 py-4 overflow-hidden">
            <div
              className={htmlTextClassName}
              dangerouslySetInnerHTML={{
                __html: tri_verhnie_vkladki.czentralnaya_gruppa.tekst,
              }}
            />
            <Image
              src={tri_verhnie_vkladki.czentralnaya_gruppa.izobrazhenie}
              alt=""
              width={88}
              height={88}
              className="absolute -bottom-6 -right-6 h-24 w-24 opacity-70"
            />
          </Tile>
          <Tile className="relative lg:col-span-4 h-24 px-5 py-4 overflow-hidden">
            <div
              className={htmlTextClassName}
              dangerouslySetInnerHTML={{
                __html: tri_verhnie_vkladki.pravaya_gruppa.tekst,
              }}
            />
            <Image
              src={tri_verhnie_vkladki.pravaya_gruppa.izobrazhenie}
              alt=""
              width={88}
              height={88}
              className="absolute -bottom-6 -right-6 h-24 w-24 opacity-70"
            />
          </Tile>

          <Tile className="relative lg:col-span-3 h-40 px-4 py-4 overflow-hidden">
            <div
              className={htmlTextClassName}
              dangerouslySetInnerHTML={{
                __html:
                  czentralnye_vkladki.verhnyaya_levaya_czentralnaya_vkladka.tekst,
              }}
            />
            <Image
              src={
                czentralnye_vkladki.verhnyaya_levaya_czentralnaya_vkladka
                  .izobrazhenie
              }
              alt=""
              width={96}
              height={96}
              className="absolute inset-0 m-auto -bottom-24 w-20 h-20 opacity-75"
            />
          </Tile>
          <div className="lg:col-span-6 lg:row-span-2 h-[260px] sm:h-[340px] rounded-3xl border border-border/60 bg-card/90 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,195,0,0.25),_transparent_65%)]" />
            <Logo3D className="absolute inset-0 z-10" />
          </div>
          <Tile className="relative lg:col-span-3 h-40 px-4 py-4 overflow-hidden">
            <div
              className={htmlTextClassName}
              dangerouslySetInnerHTML={{
                __html:
                  czentralnye_vkladki.verhnyaya_pravaya_czentralnaya_vkladka
                    .tekst,
              }}
            />
            <Image
              src={
                czentralnye_vkladki.verhnyaya_pravaya_czentralnaya_vkladka
                  .izobrazhenie
              }
              alt=""
              width={96}
              height={96}
              className="absolute inset-0 m-auto -bottom-24 w-20 h-20 opacity-75"
            />
          </Tile>
          <Tile className="relative lg:col-span-3 h-40 px-4 py-4 overflow-hidden">
            <div
              className={htmlTextClassName}
              dangerouslySetInnerHTML={{
                __html:
                  czentralnye_vkladki.nizhnyaya_levaya_czentralnaya_vkladka.tekst,
              }}
            />
            <Image
              src={
                czentralnye_vkladki.nizhnyaya_levaya_czentralnaya_vkladka
                  .izobrazhenie
              }
              alt=""
              width={96}
              height={96}
              className="absolute inset-0 m-auto -bottom-24 w-20 h-20 opacity-75"
            />
          </Tile>
          <Tile className="relative lg:col-span-3 h-40 px-4 py-4 overflow-hidden">
            <div
              className={htmlTextClassName}
              dangerouslySetInnerHTML={{
                __html:
                  czentralnye_vkladki.nizhnyaya_pravaya_czentralnaya_vkladka
                    .tekst,
              }}
            />
            <Image
              src={
                czentralnye_vkladki.nizhnyaya_pravaya_czentralnaya_vkladka
                  .izobrazhenie
              }
              alt=""
              width={96}
              height={96}
              className="absolute inset-0 m-auto -bottom-24 w-20 h-20 opacity-75"
            />
          </Tile>

          <Tile className="lg:col-span-6 h-24 px-6 py-4 flex items-center justify-center text-center">
            <div
              className="text-lg md:text-2xl font-semibold text-foreground [&_strong]:font-bold [&_strong]:text-primary [&_em]:not-italic [&_em]:font-light [&_br]:block"
              dangerouslySetInnerHTML={{
                __html: dve_nizhnie_vkladki.levaya_vkladka.tekst,
              }}
            />
          </Tile>
          <Tile className="lg:col-span-6 h-24 px-6 py-4 flex items-center justify-center text-center">
            <div
              className="text-lg md:text-2xl font-semibold text-foreground [&_strong]:font-bold [&_strong]:text-primary [&_em]:not-italic [&_em]:font-light [&_br]:block"
              dangerouslySetInnerHTML={{
                __html: dve_nizhnie_vkladki.pravaya_vkladka.tekst,
              }}
            />
          </Tile>
        </div>
      </div>
    </section>
  )
}

