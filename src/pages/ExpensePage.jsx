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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-blue-600 bg-clip-text text-transparent mb-2">
            Expenses
          </h1>
          <p className="text-slate-600">Track, manage, and control your expenses easily</p>
          
          {/* Total Amount Display */}
          {totalExpenseAmount > 0 && (
            <div className="mt-3 inline-block bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg px-4 py-2">
              <span className="text-sm text-slate-600">Total Expenses: </span>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                ₹{totalExpenseAmount.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>
        <Button
          size="sm"
          onClick={handleExpenseForm}
          className="bg-gradient-to-r from-blue-600 to-teal-600 text-white"
        >
          Add Expense
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-slate-600 font-medium">Loading Expenses...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center text-red-500 py-8">
          <p className="font-medium">Failed to load expenses 😢</p>
          <Button onClick={fetchData} className="mt-3 bg-blue-600 text-white">
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
          {expenseData?.data?.pagination?.pages > 1 && (
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
                Page {currentPage} of {expenseData.data.pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === expenseData.data.pagination.pages}
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