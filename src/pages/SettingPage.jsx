"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Palette, LogOut, Save } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    expenseAdded: true,
    paymentReceived: true,
    settlementReminder: false,
    weeklyReport: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    expenseHistory: false,
    balanceVisible: true,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 text-lg">Manage your account preferences and privacy settings</p>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Shield className="h-4 w-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Palette className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-blue-700">Profile Information</CardTitle>
                  <CardDescription>Update your personal information and profile picture</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
                      <AvatarFallback className="text-xl">JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline">Change Photo</Button>
                      <p className="text-sm text-gray-600 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" placeholder="Tell us about yourself..." />
                  </div>

                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-blue-700">Notification Preferences</CardTitle>
                  <CardDescription>Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">New Expense Added</h4>
                        <p className="text-sm text-gray-600">Get notified when someone adds a new expense</p>
                      </div>
                      <Switch
                        checked={notifications.expenseAdded}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, expenseAdded: checked }))}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Payment Received</h4>
                        <p className="text-sm text-gray-600">Get notified when you receive a payment</p>
                      </div>
                      <Switch
                        checked={notifications.paymentReceived}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({ ...prev, paymentReceived: checked }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Settlement Reminders</h4>
                        <p className="text-sm text-gray-600">Remind me about pending settlements</p>
                      </div>
                      <Switch
                        checked={notifications.settlementReminder}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({ ...prev, settlementReminder: checked }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Weekly Reports</h4>
                        <p className="text-sm text-gray-600">Receive weekly spending summaries</p>
                      </div>
                      <Switch
                        checked={notifications.weeklyReport}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weeklyReport: checked }))}
                      />
                    </div>
                  </div>

                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-6">
              <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-blue-700">Privacy & Security</CardTitle>
                  <CardDescription>Control your privacy and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Profile Visibility</h4>
                        <p className="text-sm text-gray-600">Allow others to see your profile information</p>
                      </div>
                      <Switch
                        checked={privacy.profileVisible}
                        onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, profileVisible: checked }))}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Expense History</h4>
                        <p className="text-sm text-gray-600">Allow friends to see your expense history</p>
                      </div>
                      <Switch
                        checked={privacy.expenseHistory}
                        onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, expenseHistory: checked }))}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Balance Visibility</h4>
                        <p className="text-sm text-gray-600">Show your balance information to group members</p>
                      </div>
                      <Switch
                        checked={privacy.balanceVisible}
                        onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, balanceVisible: checked }))}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-4">Account Security</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Enable Two-Factor Authentication
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Download Account Data
                      </Button>
                    </div>
                  </div>

                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences" className="space-y-6">
              <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-blue-700">App Preferences</CardTitle>
                  <CardDescription>Customize your app experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="cad">CAD (C$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="est">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="est">Eastern Time</SelectItem>
                          <SelectItem value="cst">Central Time</SelectItem>
                          <SelectItem value="mst">Mountain Time</SelectItem>
                          <SelectItem value="pst">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Select defaultValue="light">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-4">Default Split Settings</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="defaultSplit">Default Split Type</Label>
                        <Select defaultValue="equal">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equal">Split Equally</SelectItem>
                            <SelectItem value="percentage">By Percentage</SelectItem>
                            <SelectItem value="exact">Exact Amounts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="backdrop-blur-xl bg-red-50/80 border-red-200 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-red-700">Danger Zone</CardTitle>
                  <CardDescription>Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out of All Devices
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
