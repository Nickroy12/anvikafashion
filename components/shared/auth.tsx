"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

/** Returns the dashboard path for a given role. */
function getDashboardPath(role?: string | null): string {
  if (role === "admin") return "/dashboard/admin"
  return "/dashboard/customer"
}

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()

  // Password validation
  const hasLength = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const isValidPassword = hasLength && hasNumber && hasUppercase

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!isLogin && !isValidPassword) {
      setErrorMsg("Please enter a valid password")
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        const { data, error } = await authClient.signIn.email({
          email,
          password,
        })
        if (error) {
          setErrorMsg(error.message || "Failed to sign in")
        } else {
          const role = (data?.user as any)?.role
          router.push(getDashboardPath(role))
          router.refresh()
        }
      } else {
        const { data, error } = await authClient.signUp.email({
          email,
          password,
          name,
        })
        if (error) {
          setErrorMsg(error.message || "Failed to sign up")
        } else {
          const role = (data?.user as any)?.role
          router.push(getDashboardPath(role))
          router.refresh()
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setErrorMsg(null)
    setLoading(true)
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/"
      })
      if (error) {
        setErrorMsg(error.message || "Failed to login with Google")
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 shadow-2xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900/50 m-4 rounded-xl">
        <button
          type="button"
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${isLogin ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => setIsLogin(true)}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${!isLogin ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>

      <div className="px-8 pb-8 pt-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight">{isLogin ? "Welcome back" : "Create an account"}</h2>
          <p className="text-sm text-muted-foreground mt-2">
            {isLogin ? "Enter your details to access your account" : "Join us and start shopping today"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground disabled:opacity-50"
                    disabled={loading}
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground disabled:opacity-50"
              disabled={loading}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground disabled:opacity-50"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <AnimatePresence>
            {!isLogin && password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 mt-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 text-sm space-y-2">
                  <p className="font-medium text-foreground/80 mb-1">Password requirements:</p>
                  <div className={`flex items-center gap-2 ${hasLength ? "text-emerald-500" : "text-muted-foreground"}`}>
                    {hasLength ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasNumber ? "text-emerald-500" : "text-muted-foreground"}`}>
                    {hasNumber ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span>Contains a number</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasUppercase ? "text-emerald-500" : "text-muted-foreground"}`}>
                    {hasUppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span>Contains an uppercase letter</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLogin && (
            <div className="flex justify-end pt-1">
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading || (!isLogin && !isValidPassword)}
            className="w-full py-6 text-base font-semibold rounded-xl group relative overflow-hidden mt-4 disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            {/* Hover effect gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-center text-sm text-muted-foreground mb-4">Or continue with</p>
          <div className="flex gap-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-5 rounded-xl border-zinc-200 dark:border-zinc-800 flex gap-2 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>

          </div>
        </div>
      </div>
    </div>
  )
}
