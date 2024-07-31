import { ZoomAndFade } from "components/Animations"
import SubscriptionTable from "components/SubscriptionTable"
import { generateMetadata } from "lib/metadata"

export const metadata = generateMetadata({
  title: "Langgan",
})

export default function Home() {
  return (
    <main>
      <section className="relative pt-20 pb-16 overflow-hidden lg:pt-24 bg-primary/10 dark:bg-dark">
        <div className="flex flex-wrap justify-center gap-3 px-4 mt-4 mb-8 lg:gap-6 md:px-20">
          <div className="flex flex-col items-center w-full gap-8">
            <ZoomAndFade triggerOnce>
              <p className="text-4xl font-bold text-center lg:text-6xl text-dark dark:text-white">
                Pilih Pelan Anda
              </p>
            </ZoomAndFade>

            <SubscriptionTable />
          </div>
        </div>
      </section>
    </main>
  )
}
