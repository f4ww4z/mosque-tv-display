"use client"

import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const LoginForm = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const redirectToAdminDashboard = () => {
    if (window) {
      window.location.href = "/admin/dashboard"
    } else {
      router.push("/admin/dashboard")
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      redirectToAdminDashboard()
    }
  }, [status])

  const onSubmit = async (event: FormEvent) => {
    setLoading(true)
    setErrorMessage("")

    try {
      event.preventDefault()

      const res = await signIn("emailpassword", {
        email,
        password,
        redirect: false,
      })
      console.log(res)

      if (res.error) {
        throw new Error("Invalid credentials")
      }

      redirectToAdminDashboard()
    } catch (error) {
      setErrorMessage(error.message ?? "An unknown error occured.")
      setLoading(false)
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md p-6 rounded-xl bg-black/60">
      <h1 className="mb-4 text-4xl font-bold">Admin Login</h1>

      {errorMessage && (
        <div className="p-2 text-lg font-bold text-red-500">{errorMessage}</div>
      )}

      <form
        onSubmit={onSubmit}
        className="flex flex-col w-full gap-2"
      >
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="p-2 rounded-md bg-black/70"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="p-2 rounded-md bg-black/70"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex flex-col w-full gap-2 mt-3 md:flex-row md:flex-nowrap">
          <Link
            href="/"
            className="w-full p-2 text-center transition bg-gray-500 rounded-md hover:bg-blue-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Go Back
          </Link>
          <button
            type="submit"
            className="w-full p-2 text-center transition bg-blue-500 rounded-md hover:bg-blue-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
