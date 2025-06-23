import Image from "next/image"
import Link from "next/link"
import { FaFacebook, FaInstagram } from "react-icons/fa"
import { IoIosMail } from "react-icons/io"

export default function Footer() {
  return (
    <footer className="flex flex-col items-center px-4 pb-4 text-white pt-7 bg-gradient-to-tr from-dark to-primary-darker">
      <div className="flex flex-wrap items-center justify-center">
        <Link
          href="#"
          className="mr-0 p-2 lg:mr-10 rounded-xl"
        >
          <Image
            className="w-[150px] h-auto"
            src="/logo.png"
            alt="logo creative light"
            width={320}
            height={0}
          />
        </Link>
        <div className="flex flex-col items-end gap-2 mt-5 md:mt-0 sm:ml-6 sm:items-start">
          <Link
            href="/about"
            className="text-xl font-bold uppercase transition hover:text-accent"
          >
            Tentang Kami
          </Link>
          <Link
            href="/contact-us"
            className="text-xl font-bold uppercase transition hover:text-accent"
          >
            Hubungi Kami
          </Link>
          {/* <Link
            href="/privacy-policy"
            className="text-xl font-bold uppercase transition hover:text-accent"
          >
            Dasar Privasi
          </Link> */}

          <div className="flex gap-3 mt-3">
            <Link
              className="flex items-center justify-center w-12 text-5xl text-white transition hover:text-accent"
              href="mailto:info@creativelight.tech"
            >
              <IoIosMail />
            </Link>
            <Link
              className="flex items-center justify-center w-12 text-5xl text-white transition hover:text-accent"
              href="https://www.facebook.com/creativelight.tech"
              target="_blank"
            >
              <FaFacebook />
            </Link>
            <Link
              className="flex items-center justify-center w-12 text-5xl text-white transition hover:text-accent"
              href="https://www.instagram.com/creativelight.tech/"
              target="_blank"
            >
              <FaInstagram />
            </Link>
          </div>
        </div>
      </div>
      <p className="mt-2 text-lg font-bold text-center">
        ⓒ Creative Light {new Date().getFullYear()}. All Rights Reserved.
      </p>
    </footer>
  )
}
