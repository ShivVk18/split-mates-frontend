import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Upload,
  Clock,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GoogleLoginButton } from '@/components/ui/GoogleLoginButton'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import axios from 'axios'


const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  userName: z.string().min(3, 'Username must be at least 3 characters').optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number'),
  timezone: z.string(),
  currency: z.string(),
  avatar: z.any().optional(),
})



const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3, ease: "easeOut" }
}

const timezones = [
  { value: 'IST', label: 'IST (Indian Standard Time)' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'EST', label: 'EST (Eastern Standard Time)' },
  { value: 'PST', label: 'PST (Pacific Standard Time)' },
  { value: 'GMT', label: 'GMT (Greenwich Mean Time)' }
]

const currencies = [
  { value: 'INR', label: 'INR (₹)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' }
]

export function SignUpForm({ isLoading, onSubmit, onGoogleSuccess, onGoogleError }) {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      userName: '',
      email: '',
      password: '',
      phone: '',
      timezone: 'IST',
      currency: 'INR',
    },
  })

  const handleSubmit = async(data) => {
      try {
         const formdata = new FormData()

         formdata.append('name',data.name)
         formdata.append('userName',data.userName)
         formdata.append('email',data.email)
         formdata.append('password',data.password)
         formdata.append('phone',data.phone)
         formdata.append('timezone',data.timezone)
         formdata.append('currency',data.currency)

         if(data.avatar){
            formdata.append('avatar',data.avatar)
         }

         const response = await axios.post('/api/v1/auth/sign-up',formdata,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
         })

         if(response.status ===201){
            console.log("✅ User created:", response.data);
         }
      } catch (error) {
          console.error("❌ Signup failed:", error);
      }
  }

  return (
    <motion.div
      {...scaleIn}
      className="space-y-4"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold text-sm">
                  Full Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Enter your full name"
                      className="pl-10 h-11 border-border/80 bg-muted/30 focus:bg-background text-foreground rounded-xl outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username */}
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold text-sm">
                  Username
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Choose a username"
                      className="pl-10 h-11 border-border/80 bg-muted/30 focus:bg-background text-foreground rounded-xl outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold text-sm">
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-11 border-border/80 bg-muted/30 focus:bg-background text-foreground rounded-xl outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold text-sm">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
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
                      placeholder="Enter password (min 8 characters)"
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

          {/* Avatar Upload */}
          <FormField
            control={form.control}
            name="avatar"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold text-sm">
                  Profile Picture
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Upload className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="file"
                      accept="image/*"
                      className="pl-10 h-11 border-border/80 bg-muted/30 focus:bg-background text-foreground rounded-xl outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 cursor-pointer"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Timezone & Currency */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold text-sm">Timezone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 border-border/80 bg-muted/30 focus:bg-background rounded-xl">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover text-popover-foreground border border-border/80">
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold text-sm">Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 border-border/80 bg-muted/30 focus:bg-background rounded-xl">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover text-popover-foreground border border-border/80">
                      {currencies.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <span>Create Account</span>
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