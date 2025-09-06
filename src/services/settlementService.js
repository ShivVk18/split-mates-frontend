import api from "@/utils/AxiosInstance";

// Settlement Services
export const settlementService = {
  // Create a new settlement
  createSettlement: async (settlementData) => {
    try {
      const response = await api.post('/settlements', settlementData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create settlement');
    }
  },

  // Get settlement history with pagination and filters
  getSettlementHistory: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/settlements/history?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch settlement history');
    }
  },

  // Get pending settlements
  getPendingSettlements: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/settlements/pending?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pending settlements');
    }
  },

  // Mark settlement as complete
  markSettlementComplete: async (settlementId) => {
    try {
      const response = await api.patch('/settlements/complete', { settlementId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to complete settlement');
    }
  },

  // Get balance summary for user
  getBalanceSummary: async (groupId = null) => {
    try {
      const params = groupId ? `?groupId=${groupId}` : '';
      const response = await api.get(`/settlements/balance${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch balance summary');
    }
  },

  // Get group settlements
  getGroupSettlements: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/settlements/group?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch group settlements');
    }
  },

  // Calculate optimal settlement for a group
  calculateOptimalSettlement: async (groupId) => {
    try {
      const response = await api.get(`/settlements/optimize?groupId=${groupId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to calculate optimal settlement');
    }
  }
};

// Helper functions for settlement operations
export const settlementHelpers = {
  // Format currency amount
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // Get settlement status display text and color
  getSettlementStatusInfo: (status) => {
    const statusMap = {
      'PENDING': { text: 'Pending', color: 'orange', variant: 'secondary' },
      'COMPLETED': { text: 'Completed', color: 'green', variant: 'default' },
      'CANCELLED': { text: 'Cancelled', color: 'red', variant: 'destructive' }
    };
    return statusMap[status] || { text: status, color: 'gray', variant: 'outline' };
  },

  // Get payment method display text
  getPaymentMethodText: (method) => {
    const methodMap = {
      'CASH': 'Cash',
      'VENMO': 'Venmo',
      'PAYPAL': 'PayPal',
      'BANK_TRANSFER': 'Bank Transfer',
      'UPI': 'UPI',
      'CARD': 'Card'
    };
    return methodMap[method] || method;
  },

  // Calculate net balance from balance data
  calculateNetBalance: (totalOwed, totalOwing) => {
    return totalOwed - totalOwing;
  },

  // Format settlement direction text
  formatSettlementDirection: (settlement, currentUserId) => {
    if (settlement.paidById === currentUserId) {
      return `You → ${settlement.paidTo.name}`;
    } else {
      return `${settlement.paidBy.name} → You`;
    }
  },

  // Check if user owes money in settlement
  isUserPaying: (settlement, currentUserId) => {
    return settlement.paidById === currentUserId;
  },

  // Group settlements by date
  groupSettlementsByDate: (settlements) => {
    const grouped = {};
    
    settlements.forEach(settlement => {
      const date = new Date(settlement.createdAt).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(settlement);
    });

    return grouped;
  },

  // Calculate total settlement amount for a period
  calculateTotalSettlementAmount: (settlements, currentUserId, type = 'all') => {
    return settlements.reduce((total, settlement) => {
      if (type === 'paid' && settlement.paidById === currentUserId) {
        return total + settlement.amount;
      }
      if (type === 'received' && settlement.paidToId === currentUserId) {
        return total + settlement.amount;
      }
      if (type === 'all') {
        return total + settlement.amount;
      }
      return total;
    }, 0);
  },

  // Validate settlement data
  validateSettlementData: (settlementData) => {
    const errors = {};

    if (!settlementData.paidToId) {
      errors.paidToId = 'Please select who you are paying';
    }

    if (!settlementData.amount || settlementData.amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }

    if (!settlementData.method) {
      errors.method = 'Payment method is required';
    }

    if (settlementData.paidToId === settlementData.paidById) {
      errors.paidToId = 'You cannot pay yourself';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Filter settlements based on criteria
  filterSettlements: (settlements, filters) => {
    return settlements.filter(settlement => {
      // Status filter
      if (filters.status && settlement.status !== filters.status) {
        return false;
      }

      // Method filter
      if (filters.method && settlement.method !== filters.method) {
        return false;
      }

      // Date range filter
      if (filters.startDate || filters.endDate) {
        const settlementDate = new Date(settlement.createdAt);
        if (filters.startDate && settlementDate < new Date(filters.startDate)) {
          return false;
        }
        if (filters.endDate && settlementDate > new Date(filters.endDate)) {
          return false;
        }
      }

      // Amount range filter
      if (filters.minAmount && settlement.amount < parseFloat(filters.minAmount)) {
        return false;
      }
      if (filters.maxAmount && settlement.amount > parseFloat(filters.maxAmount)) {
        return false;
      }

      // Group filter
      if (filters.groupId && settlement.groupId !== filters.groupId) {
        return false;
      }

      return true;
    });
  },

  // Sort settlements by various criteria
  sortSettlements: (settlements, sortBy = 'createdAt', sortOrder = 'desc') => {
    return [...settlements].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });
  },

  // Get settlement statistics
  getSettlementStats: (settlements, currentUserId) => {
    const totalSettlements = settlements.length;
    const completedSettlements = settlements.filter(s => s.status === 'COMPLETED').length;
    const pendingSettlements = settlements.filter(s => s.status === 'PENDING').length;
    
    const totalPaid = this.calculateTotalSettlementAmount(settlements, currentUserId, 'paid');
    const totalReceived = this.calculateTotalSettlementAmount(settlements, currentUserId, 'received');
    
    return {
      totalSettlements,
      completedSettlements,
      pendingSettlements,
      totalPaid,
      totalReceived,
      completionRate: totalSettlements > 0 ? (completedSettlements / totalSettlements) * 100 : 0
    };
  }
};

export default settlementService;