import Signage from "components/Signage"
import { generateMetadata } from "lib/metadata"

export const metadata = generateMetadata({
  title: "Paparan Digital",
})

export default function Page({ params }: { params: { masjidId: string } }) {
  return (
    <main>
      <Signage masjidId={params.masjidId} />
    </main>
  )
}
