import { 
  Calculator, 
  Users, 
  Sparkles, 
  Shield, 
  Smartphone, 
  BarChart3,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Home,
  Receipt,
  Bell,
  Settings
} from 'lucide-react'

export const FEATURES = [
  {
    icon: Calculator,
    title: 'Smart Bill Splitting',
    description: 'Split bills by equal amounts, custom values, or percentages with real-time calculations and instant notifications.'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    description: 'Get intelligent spending reports, smart budgeting suggestions, and personalized financial insights.'
  },
  {
    icon: Users,
    title: 'Group Management',
    description: 'Create and manage expense groups with friends, family, or roommates with advanced permission controls.'
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'Enterprise-grade security with end-to-end encryption, secure authentication, and data protection.'
  },
  {
    icon: Smartphone,
    title: 'Real-time Sync',
    description: 'Instant synchronization across all devices with offline support and automatic conflict resolution.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive spending analytics, custom reports, and detailed insights into your financial habits.'
  }
]

export const STATS = [
  { number: '50K+', label: 'Active Users', icon: Users },
  { number: '$10M+', label: 'Bills Split', icon: DollarSign },
  { number: '250K+', label: 'Expenses Tracked', icon: BarChart3 },
  { number: '99.9%', label: 'Uptime', icon: Clock }
]

export const DASHBOARD_STATS = [
  {
    title: 'Total Expenses',
    value: '$9,661.50',
    change: '+12.5%',
    trend: 'up' as const,
    icon: DollarSign,
    color: 'from-blue-500 to-teal-500'
  },
  {
    title: 'Your Share',
    value: '$1,781.10',
    change: '+8.2%',
    trend: 'up' as const,
    icon: PieChart,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Amount Owed',
    value: '$156.84',
    change: '-23.1%',
    trend: 'down' as const,
    icon: ArrowUpRight,
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'Amount Owing',
    value: '$89.50',
    change: '+15.3%',
    trend: 'up' as const,
    icon: ArrowDownLeft,
    color: 'from-green-500 to-emerald-500'
  }
]

export const SIDEBAR_ITEMS = [
  { id: 'overview', icon: Home, label: 'Overview' },
  { id: 'groups', icon: Users, label: 'Groups' },
  { id: 'expenses', icon: Receipt, label: 'Expenses' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'ai-insights', icon: Sparkles, label: 'AI Insights' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'settings', icon: Settings, label: 'Settings' }
]

export const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'College Student',
    avatar: 'SJ',
    content: 'SplitMates has completely transformed how my roommates and I handle shared expenses. The AI insights have helped us save over $200 this month!',
    rating: 5
  },
  {
    name: 'Mike Chen',
    role: 'Travel Enthusiast',
    avatar: 'MC',
    content: 'Perfect for group trips! The real-time sync means everyone stays updated, and the expense categorization makes travel budgeting effortless.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Young Professional',
    avatar: 'ER',
    content: 'The analytics dashboard is incredible. I finally understand my spending patterns and the smart suggestions have helped me budget better.',
    rating: 5
  }
]

export const PRICING_PLANS = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      'Up to 3 groups',
      'Basic bill splitting',
      'Mobile app access',
      'Email support',
      '10 expenses per month'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Pro',
    price: 9,
    description: 'For power users and larger groups',
    features: [
      'Unlimited groups',
      'AI-powered insights',
      'Advanced analytics',
      'Priority support',
      'Export reports',
      'Custom categories',
      'Receipt scanning'
    ],
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    name: 'Team',
    price: 19,
    description: 'For organizations and large groups',
    features: [
      'Everything in Pro',
      'Team management',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'Advanced permissions',
      'API access'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]