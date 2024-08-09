import EventsList from "components/EventsList"
import { generateMetadata } from "lib/metadata"

export const metadata = generateMetadata({
  title: "Aktiviti-Aktiviti Masjid",
})

export default function Page({ params }: { params: { masjidId: string } }) {
  return (
    <main className="flex justify-center w-full px-2 pt-4">
      <EventsList masjidId={params.masjidId} />
    </main>
  )
}
