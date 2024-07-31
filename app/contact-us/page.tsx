import { ZoomAndFade } from "components/Animations"
import { generateMetadata } from "lib/metadata"
import Link from "next/link"
import { FaInstagram, FaLinkedin, FaPhoneAlt } from "react-icons/fa"
import { FaFacebook } from "react-icons/fa6"
import { IoIosMail } from "react-icons/io"

export const metadata = generateMetadata({
  title: "Hubungi Kami",
})

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center w-full pt-16 pb-20 bg-primary-darker lg:pt-24">
      <ZoomAndFade triggerOnce>
        <p className="mb-12 text-5xl font-bold">Hubungi Kami</p>
      </ZoomAndFade>

      <ZoomAndFade
        triggerOnce
        className="w-full max-w-2xl px-2"
      >
        <Link
          href="mailto:info@creativelight.tech"
          className="flex items-center w-full gap-4 px-4 transition rounded-xl md:px-8 bg-primary hover:bg-primary-lighter"
        >
          <IoIosMail className="text-8xl md:text-9xl" />
          <div className="flex flex-col gap-2">
            <p className="text-3xl font-bold">E-mel</p>
            <p className="text-justify text-md">Hubungi kami melalui e-mel</p>
          </div>
        </Link>
      </ZoomAndFade>

      <ZoomAndFade
        triggerOnce
        className="w-full max-w-2xl px-2 mt-4"
      >
        <Link
          href="https://www.facebook.com/creativelight.tech"
          target="_blank"
          className="flex items-center w-full gap-4 px-4 py-3 transition rounded-xl md:px-8 bg-primary hover:bg-primary-lighter"
        >
          <FaFacebook className="mx-3 md:mx-4 text-7xl md:text-8xl" />
          <div className="flex flex-col gap-2">
            <p className="text-3xl font-bold">Facebook</p>
            <p className="text-justify text-md">Kunjungi laman Facebook kami</p>
          </div>
        </Link>
      </ZoomAndFade>

      <ZoomAndFade
        triggerOnce
        className="w-full max-w-2xl px-2 mt-4"
      >
        <Link
          href="https://www.instagram.com/creativelight.tech/"
          className="flex items-center w-full gap-4 px-4 py-3 transition rounded-xl md:px-8 bg-primary hover:bg-primary-lighter"
        >
          <FaInstagram className="mx-3 md:mx-4 text-7xl md:text-8xl" />
          <div className="flex flex-col gap-2">
            <p className="text-3xl font-bold">Instagram</p>
            <p className="text-justify text-md">DM kami di IG</p>
          </div>
        </Link>
      </ZoomAndFade>
    </main>
  )
}
