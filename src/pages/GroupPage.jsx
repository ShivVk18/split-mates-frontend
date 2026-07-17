import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import useGroupStore from "@/stores/groupStore";
import { GroupCards } from "@/components/Group/GroupCards";
import GroupForm from "@/components/Group/GroupForm";
import ViewGroupModal from "@/components/Group/ViewGroup";
import EditGroupModal from "@/components/Group/EditGroupModal";
import groupService from "@/services/groupService";
import { toast } from "sonner";
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

const GroupPage = () => {
  const [groupData, loading, error, fetchData] = useFetch("/groups/");
  const { setGroups, setPagination } = useGroupStore();

  // Modal states
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  
  // Other states
  const [loadingGroup, setLoadingGroup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync data to Zustand
  useEffect(() => {
    if (groupData && Array.isArray(groupData.groups)) {
      setGroups(groupData.groups);
      setPagination(groupData);
    }
  }, [groupData, setGroups, setPagination]);

  // Modal handlers
  const HandleGroupForm = () => setShowGroupForm(true);
  const closeGroupForm = () => setShowGroupForm(false);
  const closeViewGroup = () => setSelectedGroup(null);
  const closeEditGroup = () => setEditingGroup(null);
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setGroupToDelete(null);
  };

  // Create new group
  const onSubmit = async (data) => {
    try {
      const response = await groupService.createGroup(data);
      if (response.statusCode === 201) {
        toast.success("Group Created Successfully");
        closeGroupForm();
        fetchData();
      }
    } catch (error) {
      toast.error(error.message || "Failed to create group");
    }
  };

  // Fetch a single group by ID
  const handleViewGroup = async (groupId) => {
    setLoadingGroup(true);
    try {
      const response = await groupService.getGroupById(groupId);
      setSelectedGroup(response.data);
    } catch (error) {
      toast.error(error.message || "Failed to load group details");
    } finally {
      setLoadingGroup(false);
    }
  };

  // Edit group
  const handleEditGroup = (group) => {
    setEditingGroup(group);
  };

  const handleUpdateGroup = async (groupId, updateData) => {
    try {
      const response = await groupService.updateGroupInfo(groupId, updateData);
      if (response.statusCode === 200) {
        toast.success("Group updated successfully");
        closeEditGroup();
        fetchData();
        // Update selected group if it's open
        if (selectedGroup?.id === groupId) {
          handleViewGroup(groupId);
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to update group");
    }
  };

  // Delete group
  const handleDeleteGroup = (group) => {
    setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteGroup = async () => {
    if (!groupToDelete) return;
    
    try {
      const response = await groupService.deleteGroup(groupToDelete.id);
      if (response.statusCode === 200) {
        toast.success("Group deleted successfully");
        closeDeleteDialog();
        fetchData();
        // Close view modal if deleted group is open
        if (selectedGroup?.id === groupToDelete.id) {
          closeViewGroup();
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete group");
    }
  };

  // Leave group
  const handleLeaveGroup = async (groupId) => {
    try {
      const response = await groupService.leaveGroup(groupId);
      if (response.statusCode === 200) {
        toast.success("You have left the group");
        closeViewGroup();
        fetchData();
      }
    } catch (error) {
      toast.error(error.message || "Failed to leave group");
    }
  };

  // Add member to group
  const handleAddMember = async (groupId, userEmail) => {
    try {
      const response = await groupService.addGroupMember(groupId, userEmail);
      if (response.statusCode === 200 || response.statusCode === 201) {
        toast.success(response.message || "Member added successfully");
        handleViewGroup(groupId);
      }
    } catch (error) {
      toast.error(error.message || "Failed to add member");
    }
  };

  // Send invite
  const handleSendInvite = async (groupId, userEmail) => {
    try {
      const response = await groupService.sendGroupInvite(groupId, userEmail);
      if (response.statusCode === 201) {
        toast.success("Invite sent successfully");
      }
    } catch (error) {
      toast.error(error.message || "Failed to send invite");
    }
  };

  // Remove member
  const handleRemoveMember = async (groupId, memberId) => {
    try {
      const response = await groupService.removeMemberFromGroup(groupId, memberId);
      if (response.statusCode === 200) {
        toast.success("Member removed successfully");
        handleViewGroup(groupId);
      }
    } catch (error) {
      toast.error(error.message || "Failed to remove member");
    }
  };

  // Transfer ownership
  const handleTransferOwnership = async (groupId, newOwnerId, kickSelf = false) => {
    try {
      const response = await groupService.transferGroupOwnership(groupId, newOwnerId, kickSelf);
      if (response.statusCode === 200) {
        toast.success("Ownership transferred successfully");
        if (kickSelf) {
          closeViewGroup();
          fetchData();
        } else {
          handleViewGroup(groupId);
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to transfer ownership");
    }
  };

  // Pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData(`/groups/?page=${newPage}&limit=10`);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Groups
          </h1>
          <p className="text-xs text-muted-foreground">Make Groups, Manage and Grow</p>
        </div>
        <Button
          size="sm"
          onClick={HandleGroupForm}
          className="bg-foreground text-background hover:bg-foreground/90 font-bold rounded-full cursor-pointer px-5 py-2 text-xs"
        >
          Add Group
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          <p className="ml-3 text-muted-foreground text-xs font-medium">Loading groups...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center text-destructive py-8">
          <p className="font-medium text-xs">Failed to load groups 😢</p>
          <Button onClick={fetchData} className="mt-3 bg-foreground text-background hover:bg-foreground/90 font-bold text-xs rounded-full px-4 cursor-pointer">
            Retry
          </Button>
        </div>
      )}

      {/* Cards */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {groupData?.groups?.length ? (
              <GroupCards 
                onViewGroup={handleViewGroup}
                onEditGroup={handleEditGroup}
                onDeleteGroup={handleDeleteGroup}
              />
            ) : (
              <p className="text-slate-500 mt-6">No groups found. Create one!</p>
            )}
          </div>

          {/* Pagination */}
          {groupData?.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-slate-600">
                Page {currentPage} of {groupData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === groupData.totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* All Modals Section - Wrapped Together */}
      <>
        {/* Create Group Modal */}
        {showGroupForm && (
          <GroupForm 
            onClose={closeGroupForm} 
            onSubmit={onSubmit} 
          />
        )}

        {/* Edit Group Modal */}
        {editingGroup && (
          <EditGroupModal
            group={editingGroup}
            onClose={closeEditGroup}
            onUpdate={handleUpdateGroup}
          />
        )}

        {/* View Group Modal */}
        {selectedGroup && (
          <ViewGroupModal
            group={selectedGroup}
            onClose={closeViewGroup}
            onAddMember={handleAddMember}
            onSendInvite={handleSendInvite}
            onRemoveMember={handleRemoveMember}
            onLeaveGroup={handleLeaveGroup}
            onTransferOwnership={handleTransferOwnership}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the group "{groupToDelete?.name}". 
                All members will be removed and this action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDeleteDialog}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteGroup}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    </div>
  );
};

export default GroupPage;