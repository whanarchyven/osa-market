import Image from "next/image"


interface AboutHeroProps {
  zagolovok: string
  podzagolovok: string
  polnoekrannoe_izobrazhenie: string
}

export function AboutHero({ zagolovok, podzagolovok, polnoekrannoe_izobrazhenie }: AboutHeroProps) {
  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      <video
        src={polnoekrannoe_izobrazhenie}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex flex-col gap-6 items-center justify-center text-center px-4">
        <Image src="/logo.svg" alt="OSA-MARKET" width={400} height={400} />
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-balance">
          {zagolovok}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl text-balance">
          {podzagolovok}
        </p>
      </div> 
    </section>
  )
}
