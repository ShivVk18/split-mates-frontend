import api from "@/utils/AxiosInstance";

// Expense Services
export const expenseService = {
  // Create a new expense
  createExpense: async (expenseData) => {
    try {
      const response = await api.post('/expenses', expenseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create expense');
    }
  },

  // Update an existing expense
  updateExpense: async (expenseId, expenseData) => {
    try {
      const response = await api.put(`/expenses/${expenseId}`, expenseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update expense');
    }
  },

  // Delete an expense
  deleteExpense: async (expenseId) => {
    try {
      const response = await api.delete(`/expenses/${expenseId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete expense');
    }
  },

  // Get expense by ID
  getExpenseById: async (expenseId) => {
    try {
      const response = await api.get(`/expenses/${expenseId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expense');
    }
  },

  // Get all expenses with filters
  getAllExpenses: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all supported query parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v));
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const response = await api.get(`/expenses?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expenses');
    }
  },

  // Add tag to expense
  addTagToExpense: async (expenseId, tagId) => {
    try {
      const response = await api.post(`/expenses/${expenseId}/tags`, { tagId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add tag to expense');
    }
  },

  // Remove tag from expense
  removeTagFromExpense: async (expenseId, tagId) => {
    try {
      const response = await api.delete(`/expenses/${expenseId}/tags/${tagId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove tag from expense');
    }
  },

  // Get expenses by tag
  getExpensesByTag: async (tagId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/expenses/tag/${tagId}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expenses by tag');
    }
  },

  // Get expense statistics
  getExpenseStatistics: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/expenses/statistics?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expense statistics');
    }
  },

  // Mark expense as settled
  markExpenseAsSettled: async (expenseId, splitIds = null) => {
    try {
      const data = splitIds ? { splitIds } : {};
      const response = await api.patch(`/expenses/${expenseId}/settle`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to settle expense');
    }
  },

  // Export expenses to CSV
  exportExpensesToCSV: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/expenses/export/csv?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to export expenses');
    }
  }
};

// Helper functions for expense operations
export const expenseHelpers = {
  // Calculate user's share in an expense
  calculateUserShare: (expense, userId) => {
    const userSplit = expense.splits?.find(split => split.userId === userId);
    return userSplit?.amount || 0;
  },

  // Calculate total owed by user across expenses
  calculateTotalOwed: (expenses, userId) => {
    return expenses.reduce((total, expense) => {
      if (expense.paidById !== userId && !expense.isSettled) {
        const userSplit = expense.splits?.find(split => split.userId === userId);
        return total + (userSplit?.amount || 0);
      }
      return total;
    }, 0);
  },

  // Calculate total paid by user
  calculateTotalPaid: (expenses, userId) => {
    return expenses.reduce((total, expense) => {
      if (expense.paidById === userId) {
        return total + expense.amount;
      }
      return total;
    }, 0);
  },

  // Get expense status display text
  getExpenseStatusText: (expense) => {
    return expense.isSettled ? 'Settled' : 'Pending';
  },

  // Format expense amount with currency
  formatExpenseAmount: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // Get split type display text
  getSplitTypeText: (splitType) => {
    const splitTypeMap = {
      'EQUAL': 'Split Equally',
      'PERCENTAGE': 'By Percentage',
      'EXACT': 'Exact Amounts',
      'SHARES': 'By Shares'
    };
    return splitTypeMap[splitType] || splitType;
  },

  // Validate expense data before submission
  validateExpenseData: (expenseData) => {
    const errors = {};

    if (!expenseData.description?.trim()) {
      errors.description = 'Description is required';
    }

    if (!expenseData.amount || expenseData.amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }

    if (!expenseData.paidById) {
      errors.paidById = 'Payer is required';
    }

    if (!expenseData.splits || expenseData.splits.length === 0) {
      errors.splits = 'At least one participant is required';
    }

    if (!['EQUAL', 'PERCENTAGE', 'EXACT', 'SHARES'].includes(expenseData.splitType)) {
      errors.splitType = 'Invalid split type';
    }

    // Validate splits based on split type
    if (expenseData.splits && expenseData.splitType) {
      const totalAmount = parseFloat(expenseData.amount) || 0;
      
      if (expenseData.splitType === 'PERCENTAGE') {
        const totalPercentage = expenseData.splits.reduce((sum, split) => 
          sum + (parseFloat(split.percentage) || 0), 0
        );
        if (Math.abs(totalPercentage - 100) > 0.01) {
          errors.splits = 'Percentages must add up to 100%';
        }
      }

      if (expenseData.splitType === 'EXACT') {
        const totalSplitAmount = expenseData.splits.reduce((sum, split) => 
          sum + (parseFloat(split.amount) || 0), 0
        );
        if (Math.abs(totalSplitAmount - totalAmount) > 0.01) {
          errors.splits = 'Split amounts must equal the total expense amount';
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Filter expenses based on criteria
  filterExpenses: (expenses, filters) => {
    return expenses.filter(expense => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          expense.description.toLowerCase().includes(searchLower) ||
          expense.group?.name.toLowerCase().includes(searchLower) ||
          expense.paidBy.name.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'settled' && !expense.isSettled) return false;
        if (filters.status === 'pending' && expense.isSettled) return false;
      }

      // Date range filter
      if (filters.startDate || filters.endDate) {
        const expenseDate = new Date(expense.date);
        if (filters.startDate && expenseDate < new Date(filters.startDate)) return false;
        if (filters.endDate && expenseDate > new Date(filters.endDate)) return false;
      }

      // Amount range filter
      if (filters.minAmount && expense.amount < parseFloat(filters.minAmount)) return false;
      if (filters.maxAmount && expense.amount > parseFloat(filters.maxAmount)) return false;

      // Split type filter
      if (filters.splitType && expense.splitType !== filters.splitType) return false;

      // Group filter
      if (filters.groupId && expense.groupId !== filters.groupId) return false;

      return true;
    });
  }
};

export default expenseService;