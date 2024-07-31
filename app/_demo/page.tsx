import Signage from "components/Signage"
import { generateMetadata } from "lib/metadata"

export const metadata = generateMetadata({
  title: "Demo",
})

export default function Demo() {
  return (
    <main>
      <Signage />
    </main>
  )
}
