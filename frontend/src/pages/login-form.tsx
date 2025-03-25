import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginFormProps extends React.ComponentProps<"div"> {
  email: string
  setEmail: React.Dispatch<React.SetStateAction<string>>
  password: string
  setPassword: React.Dispatch<React.SetStateAction<string>>
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void
}

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  className,
  ...props
}: LoginFormProps) {
  return (
    // Outer wrapper to center everything vertically & horizontally
    <div
      className={cn(
        "flex min-h-screen w-full items-center justify-center bg-gray-50 px-4",
        className
      )}
      {...props}
    >
      {/* Limit the max width so it doesn’t stretch too wide */}
      <Card className="w-full max-w-2xl shadow-sm">
        <CardContent className="grid grid-cols-1 p-0 md:grid-cols-2">
          {/* Left side: the form */}
          <form className="p-6 md:p-8" onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              {/* Headings */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome </h1>
                <p className="text-sm text-muted-foreground">
                  Login to your Echo Account
                </p>
              </div>

              {/* Email field */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password field */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Submit button */}
              <Button type="submit" className="w-full">
                Login
              </Button>

              {/* Sign up link */}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>

          {/* Right side: image or placeholder */}
          <div className="relative hidden bg-muted md:block">
            {/* Replace /image.png with your own placeholder or illustration */}
            <img
              src="/image.png"
              alt="Placeholder"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      {/* Optionally, you can move this text inside the Card if desired */}
      {/* 
        <div className="mt-4 text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      */}
    </div>
  )
}
