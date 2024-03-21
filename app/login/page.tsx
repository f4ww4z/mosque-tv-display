import LoginForm from "components/LoginForm"

export const metadata = {
  title: "Login | Mosque TV Display",
  description: "Login to admin dashboard for TV display for mosques",
}

export default function Login() {
  return (
    <main
      className="flex flex-col items-center justify-center w-full h-screen"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
      }}
    >
      <LoginForm />
    </main>
  )
}
