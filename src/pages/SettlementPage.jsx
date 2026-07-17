import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Filter, TrendingUp, TrendingDown } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import useSettlementStore from "@/stores/settlementStore";
import { SettlementCards } from "@/components/Settlement/SettlementCard";
import CreateSettlementForm from "@/components/Settlement/SettlementForm";
import ViewSettlementModal from "@/components/Settlement/ViewSettlementModal";
import BalanceSummaryCard from "@/components/Settlement/BalanceSummaryCard";
import OptimalSettlementModal from "@/components/Settlement/OptimalSettlementModal";
import settlementService from "@/services/settlementService";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const SettlementPage = () => {
  // Fetch settlement history
  const [settlementData, loading, error, fetchData] = useFetch("/settlements/history");
  const { setSettlements, setPagination } = useSettlementStore();
  
  // Fetch balance summary
  const [balanceData, balanceLoading, balanceError, fetchBalance] = useFetch("/settlements/balance");
  
  // Fetch groups for form dropdown
  const [groupData, groupLoading] = useFetch("/groups/");

  // Modal states
  const [showSettlementForm, setShowSettlementForm] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [showOptimalModal, setShowOptimalModal] = useState(false);
  const [selectedGroupForOptimal, setSelectedGroupForOptimal] = useState(null);
  
  // Filter states
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Sync data to Zustand
  useEffect(() => {
    if (settlementData?.settlements) {
      setSettlements(settlementData.settlements);
      setPagination({
        currentPage: settlementData.currentPage,
        totalPages: settlementData.totalPages,
        totalItems: settlementData.totalItems,
      });
    }
  }, [settlementData, setSettlements, setPagination]);

  const { settlements } = useSettlementStore();

  // Modal handlers
  const handleOpenSettlementForm = () => setShowSettlementForm(true);
  const closeSettlementForm = () => setShowSettlementForm(false);
  const closeViewSettlement = () => setSelectedSettlement(null);

  // Create new settlement
  const onSubmit = async (data) => {
    try {
      const response = await settlementService.createSettlement(data);
      if (response.statusCode === 201) {
        toast.success("Settlement Created Successfully");
        closeSettlementForm();
        fetchData();
        fetchBalance(); // Refresh balance
      }
    } catch (error) {
      toast.error(error.message || "Failed to create settlement");
    }
  };

  // View settlement details
  const handleViewSettlement = (settlement) => {
    setSelectedSettlement(settlement);
  };

  // Mark settlement as complete
  const handleCompleteSettlement = async (settlementId) => {
    try {
      const response = await settlementService.markSettlementComplete(settlementId);
      if (response.statusCode === 200) {
        toast.success("Settlement marked as complete");
        fetchData();
        fetchBalance();
        closeViewSettlement();
      }
    } catch (error) {
      toast.error(error.message || "Failed to complete settlement");
    }
  };

  // Calculate optimal settlements for a group
  const handleCalculateOptimal = async (groupId) => {
    try {
      const response = await settlementService.calculateOptimalSettlement(groupId);
      setSelectedGroupForOptimal({
        groupId,
        data: response.data,
      });
      setShowOptimalModal(true);
    } catch (error) {
      toast.error(error.message || "Failed to calculate optimal settlement");
    }
  };

  // Tab change handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    
    if (tab === "pending") {
      fetchData("/settlements/pending");
    } else if (tab === "completed") {
      fetchData("/settlements/history?status=COMPLETED");
    } else {
      fetchData("/settlements/history");
    }
  };

  // Group filter handler
  const handleGroupFilter = (groupId) => {
    setSelectedGroup(groupId);
    setCurrentPage(1);
    
    const endpoint = activeTab === "pending" 
      ? `/settlements/pending${groupId ? `?groupId=${groupId}` : ""}`
      : `/settlements/history${groupId ? `?groupId=${groupId}` : ""}`;
    
    fetchData(endpoint);
  };

  // Pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const groupParam = selectedGroup ? `&groupId=${selectedGroup}` : "";
    const endpoint = activeTab === "pending"
      ? `/settlements/pending?page=${newPage}&limit=10${groupParam}`
      : `/settlements/history?page=${newPage}&limit=10${groupParam}`;
    
    fetchData(endpoint);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Settlements
          </h1>
          <p className="text-xs text-muted-foreground">Track and manage your payment settlements</p>
        </div>
        <div className="flex gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowOptimalModal(true)}
            className="border-border text-foreground hover:bg-accent rounded-full cursor-pointer px-4 text-xs font-semibold"
          >
            <ArrowRight className="w-3.5 h-3.5 mr-2" />
            Optimal Settlement
          </Button>
          <Button
            size="sm"
            onClick={handleOpenSettlementForm}
            className="bg-foreground text-background hover:bg-foreground/90 font-bold rounded-full cursor-pointer px-5 py-2 text-xs"
          >
            Create Settlement
          </Button>
        </div>
      </div>

      {/* Balance Summary */}
      {!balanceLoading && balanceData && (
        <BalanceSummaryCard 
          balanceData={balanceData}
          onCreateSettlement={handleOpenSettlementForm}
        />
      )}

      {/* Group Filter */}
      {groupData?.groups?.length > 0 && (
        <div className="mb-6 flex items-center gap-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedGroup || ""}
            onChange={(e) => handleGroupFilter(e.target.value || null)}
            className="px-4 py-2 border border-border bg-card text-foreground rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-foreground/15"
          >
            <option value="">All Groups</option>
            {groupData.groups.map((group) => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
      )}

      <Tabs defaultValue="all" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 h-11 bg-muted p-1 rounded-xl">
          <TabsTrigger value="all" className="h-full py-0 cursor-pointer rounded-lg">All</TabsTrigger>
          <TabsTrigger value="pending" className="h-full py-0 cursor-pointer rounded-lg">Pending</TabsTrigger>
          <TabsTrigger value="completed" className="h-full py-0 cursor-pointer rounded-lg">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
              <p className="ml-3 text-muted-foreground text-xs font-medium">Loading Settlements...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center text-destructive py-8">
              <p className="font-medium text-xs">Failed to load settlements 😢</p>
              <Button onClick={() => fetchData()} className="mt-3 bg-foreground text-background hover:bg-foreground/90 font-bold text-xs rounded-full px-4 cursor-pointer">
                Retry
              </Button>
            </div>
          )}

          {/* Settlements List */}
          {!loading && !error && (
            <>
              {settlements?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  <SettlementCards 
                    settlements={settlements}
                    onViewSettlement={handleViewSettlement}
                    onCompleteSettlement={handleCompleteSettlement}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-xs">No settlements found</p>
                  <Button 
                    onClick={handleOpenSettlementForm}
                    className="mt-4 bg-foreground text-background hover:bg-foreground/90 font-bold text-xs rounded-full px-5 py-2 cursor-pointer"
                  >
                    Create Your First Settlement
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {settlementData?.totalPages > 1 && (
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
                    Page {currentPage} of {settlementData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === settlementData.totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Settlement Modal */}
      {showSettlementForm && (
        <CreateSettlementForm
          onClose={closeSettlementForm}
          onSubmit={onSubmit}
          groups={groupData?.groups || []}
          balanceData={balanceData}
          loading={groupLoading}
        />
      )}

      {/* View Settlement Modal */}
      {selectedSettlement && (
        <ViewSettlementModal
          settlement={selectedSettlement}
          onClose={closeViewSettlement}
          onComplete={handleCompleteSettlement}
        />
      )}

      {/* Optimal Settlement Modal */}
      {showOptimalModal && (
        <OptimalSettlementModal
          groups={groupData?.groups || []}
          onClose={() => setShowOptimalModal(false)}
          onCalculate={handleCalculateOptimal}
          selectedGroupData={selectedGroupForOptimal}
        />
      )}
    </div>
  );
};

export default SettlementPage;