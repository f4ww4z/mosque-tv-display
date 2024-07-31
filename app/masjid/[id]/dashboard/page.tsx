import MasjidDashboard from "components/MasjidDashboard"
import { generateMetadata } from "lib/metadata"

export const metadata = generateMetadata({
  title: "Pentadbir Masjid",
})

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="flex flex-col items-center justify-center w-full pb-48 bg-primary-darker pt-28">
      <MasjidDashboard id={params.id} />
    </main>
  )
}
