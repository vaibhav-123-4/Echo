import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github } from "lucide-react"

interface SignUpFormProps extends React.ComponentProps<"div"> {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  email: string
  setEmail: React.Dispatch<React.SetStateAction<string>>
  password: string
  setPassword: React.Dispatch<React.SetStateAction<string>>
  handleSignUp: (e: React.FormEvent<HTMLFormElement>) => void
  loading: boolean
}

export default function SignUpPage({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  handleSignUp,
  loading,
  className,
  ...props
}: SignUpFormProps) {

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Section */}
      <div className="relative hidden w-1/2 p-8 lg:block">
        <div className="h-full w-full overflow-hidden rounded-[40px] bg-gradient-to-b from-purple-400 via-purple-600 to-black">
          <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">

           

            <div className="w-full max-w-sm space-y-4">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">1</span>
                  <span className="text-lg">Sign up your account</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    2
                  </span>
                  <span className="text-lg">login to access your account</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    3
                  </span>
                  <span className="text-lg">Enjoy</span>
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
            <h2 className="mb-2 text-3xl font-bold text-white">Sign Up Account</h2>
            <p className="mb-8 text-gray-400">Enter your personal data to create your account.</p>

          

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
             
            </div>

            <form className="space-y-6" onSubmit={handleSignUp}>
              {/* <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400"
                    placeholder="First Name"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400"
                    placeholder="Last Name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div> */}

              <div className="space-y-2">
                <Input
                  className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400"
                  placeholder="john deep"
                  type="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Input
                  className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400"
                  placeholder="john@example.com"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Input
                  className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400"
                  placeholder="1234asd..."
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-sm text-gray-400">Must be at least 6 characters.</p>
              </div>

                <Button type="submit" className="h-12 w-full bg-white text-black hover:bg-gray-100 cursor-pointer" disabled={loading}>
                {loading ? 'loading...' : 'Sign Up'}
                </Button>

              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <a href="/login" className="text-white hover:underline">
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

