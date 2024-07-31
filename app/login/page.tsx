import LoginForm from "components/LoginForm"
import { generateMetadata } from "lib/metadata"

export const metadata = generateMetadata({
  title: "Log Masuk",
})

export default function Login() {
  return (
    <main className="flex flex-col items-center justify-center w-full pb-20 bg-primary-darker pt-16 lg:pt-24">
      <LoginForm />
    </main>
  )
}
