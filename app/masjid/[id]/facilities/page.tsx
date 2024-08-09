import MasjidFacilities from "components/MasjidDashboard/MasjidFacilities"
import { generateMetadata } from "lib/metadata"

export const metadata = generateMetadata({
  title: "Fasiliti-fasiliti Masjid",
})

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="flex flex-col items-center w-full px-2 pt-16 md:px-8 bg-primary-darker pb-28">
      <MasjidFacilities id={params.id} />
    </main>
  )
}
