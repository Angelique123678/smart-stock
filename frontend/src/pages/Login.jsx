import { LoginForm } from "@/components/login-form"

export default function Login() {
  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-blue-900 to-blue-950 items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
