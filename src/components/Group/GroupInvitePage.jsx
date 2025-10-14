import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import groupService from "@/services/groupService";
import { toast } from "sonner";
import { format } from "date-fns";

const GroupInvitePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchInviteDetails = async () => {
      if (!token) {
        setError("Invalid invite link");
        setLoading(false);
        return;
      }

      try {
        const response = await groupService.viewGroupInvite(token);
        if (response.statusCode === 200) {
          setInviteData(response.data);
        }
      } catch (err) {
        setError(err.message || "Failed to load invite details");
      } finally {
        setLoading(false);
      }
    };

    fetchInviteDetails();
  }, [token]);

  const handleAccept = async () => {
    setProcessing(true);
    try {
      const response = await groupService.handleGroupInvite(token, "ACCEPT");
      if (response.statusCode === 200) {
        toast.success("Successfully joined the group!");
        setTimeout(() => {
          navigate("/groups");
        }, 2000);
      }
    } catch (err) {
      toast.error(err.message || "Failed to accept invite");
      setProcessing(false);
    }
  };

  const handleDecline = async () => {
    setProcessing(true);
    try {
      const response = await groupService.handleGroupInvite(token, "DECLINE");
      if (response.statusCode === 200) {
        toast.success("Invite declined");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      toast.error(err.message || "Failed to decline invite");
      setProcessing(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      GENERAL: "bg-slate-100 text-slate-800",
      TRIP: "bg-blue-100 text-blue-800",
      HOME: "bg-green-100 text-green-800",
      COUPLE: "bg-pink-100 text-pink-800",
      FRIENDS: "bg-purple-100 text-purple-800",
      WORK: "bg-orange-100 text-orange-800",
      PROJECT: "bg-cyan-100 text-cyan-800",
      EVENT: "bg-yellow-100 text-yellow-800",
    };
    return colors[category] || colors.GENERAL;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-slate-600 font-medium">Loading invite details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <CardTitle>Invalid Invite</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const { group, expiresAt, email } = inviteData || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mb-4 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
            Group Invitation
          </CardTitle>
          <CardDescription className="text-base mt-2">
            You've been invited to join a group
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Group Info */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{group?.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{group?.description || "No description"}</p>
              </div>
              <Badge className={getCategoryColor(group?.category)}>
                {group?.category}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="h-4 w-4 text-blue-500" />
                <span>{group?.memberCount} members</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4 text-green-500" />
                <span>{group?.currency}</span>
              </div>
            </div>
          </div>

          {/* Creator Info */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">Created by</p>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={group?.creator?.avatar} />
                <AvatarFallback>{group?.creator?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-slate-900">{group?.creator?.name}</p>
                <p className="text-sm text-slate-600">{group?.creator?.email}</p>
              </div>
            </div>
          </div>

          {/* Invite Details */}
          <div className="text-sm text-slate-600 space-y-1">
            <p>
              <span className="font-medium">Invited:</span> {email}
            </p>
            <p>
              <span className="font-medium">Expires:</span>{" "}
              {format(new Date(expiresAt), "MMM dd, yyyy 'at' hh:mm a")}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3 pt-6 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={handleDecline}
            disabled={processing}
            className="flex-1"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            disabled={processing}
            className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Accept & Join
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GroupInvitePage;