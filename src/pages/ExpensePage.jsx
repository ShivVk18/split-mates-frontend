import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import useExpenseStore from "@/stores/expenseStore";
import { ExpenseCards } from "@/components/Expense/ExpenseCard";
import AddExpense from "@/components/Expense/AddExpenseForm";
import expenseService from "@/services/expenseService";
import { toast } from "sonner";


const ExpensePage = () => {
  const navigate = useNavigate();
  
  // Fetch expenses
  const [expenseData, loading, error, fetchData] = useFetch("/expenses/");
  const { setExpenses, setPagination, totalExpenseAmount } = useExpenseStore();
    
  // Fetch groups for form dropdown
  const [groupData, groupLoading] = useFetch("/groups/");

  // Modal states
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync data to Zustand
  useEffect(() => {
    console.log("Original Data->>>>", expenseData);
    if (expenseData?.expenses) {
      console.log("📊 Setting expenses:", expenseData.expenses);
      setExpenses(expenseData.expenses);
      setPagination(expenseData.pagination); 
    }
  }, [expenseData, setExpenses, setPagination]);

  // Modal handlers
  const handleExpenseForm = () => setShowExpenseForm(true);
  const closeExpenseForm = () => setShowExpenseForm(false);  

  const { expenses } = useExpenseStore(); 

  console.log("EXPENSES STORE=>>>>", expenses);

  // Create new expense
  const onSubmit = async (data) => {
    try {
      console.log("Submitting expense:", data);
      const response = await expenseService.createExpense(data);
      if (response.statusCode === 201) {
        toast.success("Expense Created Successfully");
        closeExpenseForm();
        fetchData(); // Refresh expenses
      }
    } catch (error) {
      toast.error(error.message || "Failed to create expense");
    }
  };

  // View expense details - UPDATED TO NAVIGATE
  const handleViewExpense = (expenseId) => {
    navigate(`/expenses/${expenseId}`);
  };

  // Pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData(`/expenses/?page=${newPage}&limit=10`);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Expenses
          </h1>
          <p className="text-xs text-muted-foreground">Track, manage, and control your expenses easily</p>
          
          {/* Total Amount Display */}
          {totalExpenseAmount > 0 && (
            <div className="mt-3 inline-flex bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Expenses: </span>
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                ₹{totalExpenseAmount.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>
        <Button
          size="sm"
          onClick={handleExpenseForm}
          className="bg-foreground text-background hover:bg-foreground/90 font-bold rounded-full cursor-pointer px-5 py-2 text-xs"
        >
          Add Expense
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          <p className="ml-3 text-muted-foreground text-xs font-medium">Loading Expenses...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center text-destructive py-8">
          <p className="font-medium text-xs">Failed to load expenses 😢</p>
          <Button onClick={fetchData} className="mt-3 bg-foreground text-background hover:bg-foreground/90 font-bold text-xs rounded-full px-4 cursor-pointer">
            Retry
          </Button>
        </div>
      )}

      {/* Cards */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            <ExpenseCards onViewExpense={handleViewExpense} />
          </div>

          {/* Pagination */}
          {expenseData?.pagination?.pages > 1 && (
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
                Page {currentPage} of {expenseData.pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === expenseData.pagination.pages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Add Expense Modal */}
      {showExpenseForm && (
        <AddExpense
          onClose={closeExpenseForm}
          onSubmit={onSubmit}
          groups={groupData?.groups || []}
          loading={groupLoading}
        />
      )}
    </div>
  );
};

export default ExpensePage;