import { Car } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      {/* Logo & Brand */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <Car className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          CarTalk Pro
        </h1>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-[420px] border-border bg-card shadow-2xl shadow-black/40">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-lg font-semibold text-foreground">
            Welcome back
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <LoginForm />
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        {"Don't have an account? "}
        <button
          type="button"
          className="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors"
        >
          Sign up
        </button>
      </p>
    </main>
  )
}
