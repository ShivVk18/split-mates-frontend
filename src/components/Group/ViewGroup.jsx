import { useState, useEffect } from "react";
import { X, Users, LogOut, Mail, UserPlus, Trash2, Crown, Shield, Eye, DollarSign, Calendar, MoreVertical, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

const ViewGroupModal = ({ 
  group, 
  onClose, 
  onAddMember,
  onSendInvite,
  onRemoveMember,
  onLeaveGroup,
  onTransferOwnership
}) => {
  const [emailQuery, setEmailQuery] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [emailResult, setEmailResult] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [removeMemberDialog, setRemoveMemberDialog] = useState(null);
  const [transferDialog, setTransferDialog] = useState(false);
  const [leaveDialog, setLeaveDialog] = useState(false);
  const [selectedNewOwner, setSelectedNewOwner] = useState("");
  const [kickSelfAfterTransfer, setKickSelfAfterTransfer] = useState(false);
  
  const currentUserId = "userId"; // Replace with actual localStorage.getItem("userId")
  const isAdmin = group?.createdBy?.id === currentUserId;

  // Debounce email input (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEmail(emailQuery.trim());
    }, 500);

    return () => clearTimeout(handler);
  }, [emailQuery]);

  // Search for user by email when debounced value changes
  useEffect(() => {
    if (!debouncedEmail || debouncedEmail.length < 3) {
      setEmailResult(null);
      setEmailError(null);
      setEmailLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(debouncedEmail)) {
      setEmailError("Please enter a valid email address");
      setEmailResult(null);
      setEmailLoading(false);
      return;
    }

    let cancelled = false;

    const searchUser = async () => {
      setEmailLoading(true);
      setEmailError(null);
      setEmailResult(null);

      try {
        const response = await userService.searchByEmail(debouncedEmail);
        
        if (!cancelled) {
          if (response?.data?.user) {
            const isMember = group.members?.some(
              m => m.email.toLowerCase() === response.data.user.email.toLowerCase()
            );
            
            if (isMember) {
              setEmailError("This user is already a member of the group");
              setEmailResult(null);
            } else {
              setEmailResult(response.data);
            }
          } else {
            setEmailResult({ user: null, canInvite: true });
          }
        }
      } catch (error) {
        if (!cancelled) {
          const errorMsg = error.message || "Failed to search user";
          setEmailError(errorMsg);
          setEmailResult(null);
        }
      } finally {
        if (!cancelled) {
          setEmailLoading(false);
        }
      }
    };

    searchUser();

    return () => {
      cancelled = true;
    };
  }, [debouncedEmail, group.members]);

  const handleAddOrInvite = async () => {
    if (!emailQuery.trim() || emailQuery.trim().length < 3) {
      toast.error("Please enter a valid email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailQuery.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      if (emailResult?.user) {
        await onAddMember(group.id, emailQuery.trim());
        toast.success(`${emailResult.user.name} added to the group`);
      } else {
        await onSendInvite(group.id, emailQuery.trim());
        toast.success("Invitation sent successfully");
      }
      
      setEmailQuery("");
      setEmailResult(null);
      setEmailError(null);
    } catch (error) {
      console.error("Error adding/inviting member:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && emailQuery.trim().length >= 3 && !emailLoading) {
      handleAddOrInvite();
    }
  };

  const confirmRemoveMember = async () => {
    if (removeMemberDialog) {
      await onRemoveMember(group.id, removeMemberDialog.id);
      setRemoveMemberDialog(null);
    }
  };

  const handleTransferSubmit = async () => {
    if (!selectedNewOwner) {
      toast.error("Please select a new owner");
      return;
    }
    await onTransferOwnership(group.id, selectedNewOwner, kickSelfAfterTransfer);
    setTransferDialog(false);
    setSelectedNewOwner("");
    setKickSelfAfterTransfer(false);
  };

  const confirmLeaveGroup = async () => {
    await onLeaveGroup(group.id);
    setLeaveDialog(false);
  };

  if (!group) return null;

  const eligibleMembers = group.members?.filter(
    m => m.id !== group.createdBy?.id
  ) || [];

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
      TRAVEL: "bg-indigo-100 text-indigo-800",
      FOOD: "bg-red-100 text-red-800",
    };
    return colors[category] || colors.GENERAL;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col z-[10001]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              {group.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getCategoryColor(group.category)}>
                {group.category}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {group.currency}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {group.members?.length || 0} members
              </Badge>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 transition-colors group">
            <X className="h-5 w-5 text-slate-500 group-hover:text-slate-700" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "details"
                ? "text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Details
            {activeTab === "details" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "members"
                ? "text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Members ({group.members?.length || 0})
            {activeTab === "members" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "manage"
                ? "text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isAdmin ? "Manage" : "Add Member"}
            {activeTab === "manage" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("expenses")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "expenses"
                ? "text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Expenses
            {activeTab === "expenses" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Details Tab */}
          {activeTab === "details" && (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-900 mb-1 uppercase tracking-wide">Description</h3>
                <p className="text-slate-700">{group.description || "No description provided"}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Group Admin
                </h3>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
                  <Avatar className="h-12 w-12 border-2 border-blue-200">
                    <AvatarImage src={group.createdBy?.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {group.createdBy?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{group.createdBy?.name}</p>
                    <p className="text-sm text-slate-600">{group.createdBy?.email}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    <Crown className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-slate-600" />
                  Group Info
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Created</p>
                    <p className="font-medium text-slate-900">
                      {format(new Date(group.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Total Members</p>
                    <p className="font-medium text-slate-900">{group.members?.length || 0}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div className="space-y-3">
              {group.members?.length > 0 ? (
                group.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-11 w-11">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-teal-100 text-blue-700 font-semibold">
                            {member.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">{member.name}</p>
                          {member.id === group.createdBy?.id && (
                            <Badge variant="secondary" className="text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                          {member.isOnline && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                              Online
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{member.email}</p>
                        {member.joinedAt && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            Joined {format(new Date(member.joinedAt), "MMM dd, yyyy")}
                          </p>
                        )}
                      </div>
                    </div>
                    {isAdmin && member.id !== group.createdBy?.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setRemoveMemberDialog(member)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No members yet</p>
                  <p className="text-sm text-slate-400 mt-1">Start by inviting people to join</p>
                </div>
              )}
            </div>
          )}

          {/* Manage Tab */}
          {activeTab === "manage" && (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-5 border border-blue-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" /> 
                  Add / Invite Member
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Search for existing users by email or send an invite to new users
                </p>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Input
                        value={emailQuery}
                        onChange={(e) => setEmailQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter email address (e.g., user@example.com)"
                        className="bg-white pr-10"
                        disabled={emailLoading}
                      />
                      {emailLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleAddOrInvite}
                      disabled={emailLoading || emailQuery.trim().length < 3 || !!emailError}
                      className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {emailResult?.user ? "Add Member" : "Send Invite"}
                    </Button>
                  </div>

                  {emailLoading && debouncedEmail && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm text-blue-700">Searching for user...</p>
                    </div>
                  )}

                  {emailError && !emailLoading && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">Error</p>
                        <p className="text-sm text-red-700">{emailError}</p>
                      </div>
                    </div>
                  )}

                  {emailResult?.user && !emailLoading && !emailError && (
                    <div className="p-4 rounded-lg bg-white border-2 border-green-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <p className="text-sm font-semibold text-green-900">User Found</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-green-200">
                            <AvatarImage src={emailResult.user.avatar} />
                            <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                              {emailResult.user.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-900">{emailResult.user.name}</p>
                            <p className="text-sm text-slate-600">{emailResult.user.email}</p>
                            {emailResult.relationStatus && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {emailResult.relationStatus}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {emailResult?.canInvite && !emailResult.user && !emailLoading && !emailError && (
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="flex items-start gap-2">
                        <Mail className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-900">User not found</p>
                          <p className="text-sm text-amber-700 mt-1">
                            Click "Send Invite" to send an invitation email to <strong>{debouncedEmail}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-600">
                    <strong>Tip:</strong> Type at least 3 characters to search. Press Enter or click the button to add/invite.
                  </p>
                </div>
              </div>

              {isAdmin && eligibleMembers.length > 0 && (
                <>
                  <Separator />
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-5 border border-amber-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      <Crown className="h-5 w-5 text-amber-600" /> 
                      Transfer Ownership
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Transfer admin rights to another member. You will lose admin privileges.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setTransferDialog(true)}
                      className="w-full border-amber-300 hover:bg-amber-50"
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Transfer Group Ownership
                    </Button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Expenses Tab */}
          {activeTab === "expenses" && (
            <div className="space-y-3">
              {group.recentExpenses && group.recentExpenses.length > 0 ? (
                group.recentExpenses.map((expense) => (
                  <div key={expense.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-slate-900">{expense.description}</p>
                        <p className="text-sm text-slate-600">
                          Paid by <span className="font-medium">{expense.paidBy?.name}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-blue-600">
                          {group.currency} {expense.amount}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {expense.splitType}
                        </Badge>
                      </div>
                    </div>
                    {expense.date && (
                      <p className="text-xs text-slate-500">
                        {format(new Date(expense.date), "MMM dd, yyyy 'at' hh:mm a")}
                      </p>
                    )}
                    {expense.splits && expense.splits.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-600 uppercase tracking-wide mb-2">Split Between:</p>
                        <div className="flex flex-wrap gap-2">
                          {expense.splits.map((split, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {split.user?.name}: {group.currency} {split.amount}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No expenses yet</p>
                  <p className="text-sm text-slate-400 mt-1">Start adding expenses to track group spending</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
          {!isAdmin && (
            <Button
              variant="destructive"
              onClick={() => setLeaveDialog(true)}
              className="flex-1"
            >
              <LogOut className="mr-2 h-4 w-4" /> 
              Leave Group
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
            className={!isAdmin ? "flex-1" : "w-full"}
          >
            Close
          </Button>
        </div>
      </div>

      {/* Remove Member Dialog */}
      <AlertDialog open={!!removeMemberDialog} onOpenChange={() => setRemoveMemberDialog(null)}>
        <AlertDialogContent className="z-[10002]">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{removeMemberDialog?.name}</strong> from this group?
              They can be re-added later by sending a new invite.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveMember}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Group Dialog */}
      <AlertDialog open={leaveDialog} onOpenChange={setLeaveDialog}>
        <AlertDialogContent className="z-[10002]">
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave <strong>{group.name}</strong>?
              You'll need to be re-invited to join again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLeaveGroup}
              className="bg-red-600 hover:bg-red-700"
            >
              Leave Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transfer Ownership Dialog */}
      <AlertDialog open={transferDialog} onOpenChange={setTransferDialog}>
        <AlertDialogContent className="z-[10002]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600" />
              Transfer Group Ownership
            </AlertDialogTitle>
            <AlertDialogDescription>
              Select a new owner for this group. You will lose admin privileges and cannot undo this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Select New Owner
              </label>
              <Select value={selectedNewOwner} onValueChange={setSelectedNewOwner}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a member" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                        <span className="text-slate-500 text-sm">({member.email})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <Checkbox
                id="kickSelf"
                checked={kickSelfAfterTransfer}
                onCheckedChange={setKickSelfAfterTransfer}
                className="mt-0.5"
              />
              <label htmlFor="kickSelf" className="text-sm text-slate-700 cursor-pointer">
                Remove me from the group after transfer
                <p className="text-xs text-slate-500 mt-1">
                  If checked, you will be removed from the group immediately after transferring ownership.
                </p>
              </label>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setSelectedNewOwner("");
              setKickSelfAfterTransfer(false);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleTransferSubmit}
              className="bg-amber-600 hover:bg-amber-700"
              disabled={!selectedNewOwner}
            >
              <Crown className="mr-2 h-4 w-4" />
              Transfer Ownership
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ViewGroupModal;