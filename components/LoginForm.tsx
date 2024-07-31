"use client"

import { saveJWTToken } from "lib/auth"
import fetchJson from "lib/fetchJson"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { EmailPasswordLoginRequest, SessionUser } from "types/user"
import { ZoomAndFade } from "./Animations"
import LoadingIndicator from "./LoadingIndicator"

const LoginForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [body, setBody] = useState<EmailPasswordLoginRequest>({
    email: "",
    password: "",
  })
  const [errorMessage, setErrorMessage] = useState("")

  const fetchSessionUser = async () => {
    try {
      const user = await fetchJson<SessionUser>("/api/auth/session")

      if (user.role === "MASJID_ADMIN") {
        redirectToDashboard(user.masjidId)
      } else if (user.role === "SUPERADMIN") {
        redirectToAdminDashboard()
      }
    } catch (error) {
      // unauthenticated user
    }
  }

  const redirectToDashboard = (masjidId: string) => {
    const url = `/masjid/${masjidId}/dashboard`
    if (window) {
      window.location.href = url
    } else {
      router.push(url)
    }
  }

  const redirectToAdminDashboard = () => {
    const url = `/admin/dashboard`
    if (window) {
      window.location.href = url
    } else {
      router.push(url)
    }
  }

  useEffect(() => {
    fetchSessionUser()
  }, [])

  const onSubmit = async (event: FormEvent) => {
    setLoading(true)
    setErrorMessage("")

    try {
      event.preventDefault()

      const res = await fetchJson<{ token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      })

      saveJWTToken(res.token)

      await fetchSessionUser()
    } catch (error) {
      setErrorMessage(
        error.error || error.message || "Terdapat error yang tidak diketahui."
      )
    }

    setLoading(false)
  }

  return (
    <ZoomAndFade className="flex justify-center w-full lg:max-w-lg rounded-xl bg-black/60">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center w-full gap-2 px-6 py-10"
      >
        <h1 className="mb-4 text-4xl font-bold text-center">
          Log Masuk Pentadbir Masjid
        </h1>

        {errorMessage && (
          <div className="p-2 text-lg font-bold text-error-light">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col w-full gap-1">
          <label
            htmlFor="email"
            className="text-lg font-semibold"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Masukkan email pentadbir..."
            className="w-full p-2 text-lg bg-primary-light rounded-xl"
            value={body.email}
            onChange={(e) =>
              setBody((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col w-full gap-1">
          <label
            htmlFor="password"
            className="text-lg font-semibold"
          >
            Kata Laluan
          </label>

          <input
            id="password"
            type="password"
            placeholder="Masukkan kata laluan pentadbir..."
            className="w-full p-2 text-lg bg-primary-light rounded-xl"
            value={body.password}
            onChange={(e) =>
              setBody((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col w-full gap-2 mt-3 md:flex-row md:flex-nowrap">
          <Link
            href="/"
            className="w-full p-2 text-center transition rounded-xl bg-gray/20 hover:bg-gray/40"
          >
            Kembali
          </Link>
          <button
            type="submit"
            className="w-full p-2 text-center transition rounded-xl bg-accent hover:bg-accent/80 disabled:bg-gray disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? <LoadingIndicator /> : "Log Masuk"}
          </button>
        </div>
      </form>
    </ZoomAndFade>
  )
}

export default LoginForm
