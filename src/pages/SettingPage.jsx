import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/userStore";
import api from "@/utils/AxiosInstance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Phone, Globe, DollarSign, Camera, Check, Loader2 } from "lucide-react";
import useSEO from "@/hooks/useSEO";

const SettingPage = () => {
  useSEO({
    title: "Settings",
    description: "Update your SplitMates profile settings, currency, timezone, phone number, and avatar image."
  });

  const { user, setUser } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    timezone: "IST",
    currency: "INR",
  });
  
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        timezone: user.timezone || "IST",
        currency: user.currency || "INR",
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Upload immediately
    const uploadData = new FormData();
    uploadData.append("avatar", file);

    setUploadingAvatar(true);
    try {
      const response = await api.post("/users/avatar", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.data?.avatar) {
        toast.success("Avatar updated successfully!");
        const updatedUser = { ...user, avatar: response.data.data.avatar };
        setUser({ user: updatedUser, token: useAuthStore.getState().token });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload avatar");
      setAvatarPreview(user?.avatar || "");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put("/users/profile", formData);
      if (response.data?.data) {
        toast.success("Profile updated successfully!");
        const updatedUser = { ...user, ...response.data.data };
        setUser({ user: updatedUser, token: useAuthStore.getState().token });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
          Settings
        </h1>
        <p className="text-xs text-muted-foreground">Manage your profile, preferences, and details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card / Avatar */}
        <Card className="bg-card border-border shadow-xs md:col-span-1 h-fit">
          <CardHeader className="text-center">
            <CardTitle className="text-sm font-bold text-foreground">Profile Picture</CardTitle>
            <CardDescription>Click camera icon to change avatar</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-6">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-card shadow-md transition-all duration-300 group-hover:opacity-85">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback className="bg-foreground text-background font-bold text-2xl">
                  {getUserInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-file"
                className="absolute bottom-0 right-0 p-3 bg-foreground text-background rounded-full cursor-pointer shadow-xs hover:bg-foreground/90 transition-colors"
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </label>
              <input
                id="avatar-file"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mt-4">{user?.name || "User"}</h3>
            <p className="text-xs text-slate-500 mt-1">@{user?.userName || "username"}</p>
          </CardContent>
        </Card>

        {/* Settings Form */}
        <Card className="bg-white border-slate-200 shadow-xl md:col-span-2">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Update your general SplitMates details below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email Address (Verified)
                </Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-slate-50 text-slate-500 border-slate-200"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">
                  Mobile Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit number"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Default Currency */}
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-slate-700 font-medium">
                    Default Currency
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-xs bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/15"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                {/* Default Timezone */}
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-muted-foreground font-medium">
                    Timezone
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <select
                      id="timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-xs bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/15"
                    >
                      <option value="IST">India Standard Time (IST)</option>
                      <option value="UTC">Coordinated Universal Time (UTC)</option>
                      <option value="EST">Eastern Standard Time (EST)</option>
                      <option value="PST">Pacific Standard Time (PST)</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-border pt-6 bg-card/10">
              <Button
                type="submit"
                disabled={loading}
                className="bg-foreground text-background hover:bg-foreground/90 font-bold rounded-full cursor-pointer px-5 text-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-3.5 w-3.5" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SettingPage;