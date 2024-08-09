import { ZoomAndFade } from "components/Animations"
import HeroCarousel from "components/HeroCarousel"
import { generateMetadata } from "lib/metadata"
import Link from "next/link"

export const metadata = generateMetadata({
  title: "Papan Skrin Digital TV Masjid",
})

export default function Home() {
  return (
    <main>
      <section
        id="home"
        className="relative pb-16 overflow-hidden pt-14 lg:pt-28 bg-primary/10 dark:bg-primary-darker"
      >
        <div className="flex flex-wrap justify-center gap-3 px-4 mt-4 mb-8 lg:gap-6 md:px-20">
          <ZoomAndFade className="flex flex-col justify-center gap-2 w-full text-center xl:text-start xl:max-w-[400px]">
            <p className="text-4xl font-bold lg:text-6xl">
              Paparan TV Masjid (PTM)
            </p>
            <p className="font-medium !leading-relaxed sm:text-lg md:text-xl">
              Papan skrin digital TV masjid untuk memaparkan waktu solat,
              pengumuman, aktiviti, dan banyak lagi.
            </p>

            <ZoomAndFade className="flex flex-col items-center justify-center gap-10 my-6 text-base md:gap-3 sm:flex-row xl:justify-start xl:text-lg xl:my-4">
              <Link
                href="/login"
                className="px-8 py-4 text-lg font-semibold text-white duration-300 ease-in-out rounded-md bg-accent-dark hover:bg-accent"
              >
                Log Masuk
              </Link>
              {/* <Link
                href="/demo"
                target="_blank"
                className="px-8 py-4 font-semibold text-black duration-300 ease-in-out rounded-md bg-black/20 hover:bg-black/30 dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
              >
                Lancarkan Demo
              </Link> */}
            </ZoomAndFade>
          </ZoomAndFade>
          <ZoomAndFade
            duration={2000}
            className="w-full xl:max-w-3xl"
          >
            <HeroCarousel />
          </ZoomAndFade>
        </div>
      </section>
    </main>
  )
}
