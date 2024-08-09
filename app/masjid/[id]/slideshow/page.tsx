import MasjidSlideshow from "components/MasjidDashboard/MasjidSlideshow"
import { generateMetadata } from "lib/metadata"

export const metadata = generateMetadata({
  title: "Slideshow Masjid",
})

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="flex flex-col items-center w-full px-2 pt-16 md:px-8 bg-primary-darker pb-28">
      <MasjidSlideshow id={params.id} />
    </main>
  )
}
