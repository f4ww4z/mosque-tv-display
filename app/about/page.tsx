import { ZoomAndFade } from "components/Animations"
import { generateMetadata } from "lib/metadata"
import Link from "next/link"

export const metadata = generateMetadata({
  title: "Tentang Kami",
})

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center w-full pt-16 pb-20 bg-primary-darker lg:pt-24">
      <ZoomAndFade triggerOnce>
        <p className="px-4 mb-16 text-5xl font-bold md:px-0">Tentang Kami</p>
      </ZoomAndFade>
      <ZoomAndFade
        triggerOnce
        className="flex flex-col w-full gap-2 px-4 md:px-0 lg:max-w-2xl"
      >
        <p className="mb-3 text-3xl font-bold">Pembangunan Perisian</p>
        <p className="text-justify text-md">
          Dalam perkembangan era teknologi hari ini, Teknologi Digital telah
          menembusi kehidupan seharian kita dengan begitu pesat sekali.
        </p>
        <p className="text-justify text-md">
          Seiring dengan keperluan semasa, barisan pembangunan perisian kami
          yang dinamik, profesional, dedikasi yang memiliki pelbagai latar
          belakang kemahiran digital yang tinggi seperti pengkodan, perisian
          kepada reka bentuk mampu untuk memastikan dan menyediakan projek yang
          bernilai tinggi, innovatif dan berkualiti.
        </p>
        <p className="text-justify text-md">
          Kami bukan sekadar individu; kami adalah sebuah keluarga yang
          bersemangat tinggi, dedikasi dan mencintai elemen perisian dalam
          Teknologi Digital. Oleh itu, kami sentiasa teruja untuk membina
          perisian yang unggul dan berkualiti yang sentiasa mesra dan mudah
          digunapakai oleh pengguna.
        </p>
        <p className="text-justify text-md">
          Dengan memiliki kepakaran dalam pelbagai bahasa, perisian, kelengkapan
          dan peranti, kami mampu menyediakan permintaan semasa dalam pelbagai
          skala kerja dengan selamat. Daripada aplikasi web, penyelesaian mudah
          alih, sistem perusahaan, sistem pemantauan dan banyak lagi. Kami sedia
          membantu untuk membina impian anda bermula di sini.
        </p>
        <Link
          href="/contact-us"
          className="transition text-md text-accent hover:text-accent-dark"
        >
          Hubungi Kami!
        </Link>
      </ZoomAndFade>
    </main>
  )
}
