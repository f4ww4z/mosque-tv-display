import MasjidSettings from "components/MasjidDashboard/MasjidSettings"
import { generateMetadata } from "lib/metadata"

export const metadata = generateMetadata({
  title: "Tetapan Masjid",
})

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="flex flex-col items-center w-full px-2 pt-16 md:px-8 bg-primary-darker pb-28">
      <MasjidSettings id={params.id} />
    </main>
  )
}
