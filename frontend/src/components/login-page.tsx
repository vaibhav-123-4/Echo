import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github } from "lucide-react"

interface LoginFormProps extends React.ComponentProps<"div"> {
  email: string
  setEmail: React.Dispatch<React.SetStateAction<string>>
  password: string
  setPassword: React.Dispatch<React.SetStateAction<string>>
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void
  loading: boolean
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  loading,
  className,
  ...props
}: LoginFormProps) {
  return (
    <div className="flex min-h-screen bg-black">
    {/* Left Section */}
    <div className="relative hidden w-1/2 p-8 lg:block">
      <div className="h-full w-full overflow-hidden rounded-[40px] bg-gradient-to-b from-purple-400 via-purple-600 to-black">
        <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
         
          <h2 className="mb-6 text-4xl font-bold">Welcome! </h2>
          <p className="mb-12 text-lg">Log in to your account to continue your journey.</p>

          <div className="w-full max-w-sm space-y-4">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">1</span>
                <span className="text-lg">Log in to your account</span>
              </div>
            </div>
            <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                  2
                </span>
                <span className="text-lg">Create Posts</span>
              </div>
            </div>
            <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                  3
                </span>
                <span className="text-lg">Interact with others</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Right Section */}
    <div className="flex w-full items-center justify-center bg-black p-6 lg:w-1/2">
      <div className="w-full max-w-md rounded-[40px] p-12">
        <div className="mx-auto max-w-sm">
          <h2 className="mb-2 text-3xl font-bold text-white">Log In</h2>
          <p className="mb-8 text-gray-400">Enter your credentials to access your account.</p>

         
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Input
                className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400"
                placeholder="EXAMPLE@FLOWERSANDSAINTS.COM.AU"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Input
                className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400"
                placeholder="Your Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-between">
                <p className="text-sm text-gray-400">Must be at least 6 characters.</p>
               
              </div>
            </div>

            <Button type="submit" className="h-12 w-full bg-white text-black hover:bg-gray-100 cursor-pointer" disabled={loading}>
              { loading ? 'Loading..' : 'Log In' }
            </Button>

            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <a href="/signup" className="text-white hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  
  )
}
