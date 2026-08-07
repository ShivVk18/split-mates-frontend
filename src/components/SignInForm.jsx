import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GoogleLoginButton } from '@/components/ui/GoogleLoginButton'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const signInSchema = z.object({
  userNameorEmail: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
})

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3, ease: "easeOut" }
}

export function SignInForm({ isLoading, onSubmit, onGoogleSuccess, onGoogleError }) {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      userNameorEmail: '',
      password: '',
    },
  })

  return (
    <motion.div {...scaleIn} className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email or Username */}
          <FormField
            control={form.control}
            name="userNameorEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold text-sm">
                  Email or Username
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Enter your email or username"
                      className="pl-10 h-11 border-border/80 bg-muted/30 focus:bg-background text-foreground rounded-xl outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold text-sm">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-11 border-border/80 bg-muted/30 focus:bg-background text-foreground rounded-xl outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Forgot Password */}
          <div className="text-right">
            <Button variant="link" className="text-orange-500 hover:text-orange-600 dark:text-orange-400 p-0 h-auto text-xs font-semibold">
              Forgot Password?
            </Button>
          </div>

          {/* Submit Button & Google Login Button Side-by-Side */}
          <div className="flex items-center gap-3 pt-2">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex-grow"
            >
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Please wait...</span>
                  </div>
                ) : (
                  <span>Sign In</span>
                )}
              </Button>
            </motion.div>
            {onGoogleSuccess && (
              <GoogleLoginButton onSuccess={onGoogleSuccess} onError={onGoogleError} />
            )}
          </div>
        </form>
      </Form>
    </motion.div>
  )
}