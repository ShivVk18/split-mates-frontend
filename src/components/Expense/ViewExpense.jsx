import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import expenseService from '@/services/expenseService';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Users, CreditCard, FileText, Tag, Receipt, CheckCircle, XCircle } from 'lucide-react';

const ViewExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        setLoading(true);
        const response = await expenseService.getExpenseById(id);
        if (response.statusCode === 200) {
          setExpense(response.data);
        }
      } catch (error) {
        toast.error(error.message || 'Failed to load expense details');
        navigate('/expenses');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExpense();
    }
  }, [id, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

 const formatAmount = (amount) => {
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-slate-600 font-medium">Loading expense details...</p>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-slate-600 font-medium mb-4">Expense not found</p>
        <Button onClick={() => navigate('/expenses')} className="bg-blue-600 text-white">
          Back to Expenses
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/expenses')}
        className="mb-6 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Expenses
      </Button>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 md:p-8 text-white mb-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{expense.description}</h1>
            <div className="flex items-center gap-2 text-blue-100">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(expense.date)}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100 mb-1">Total Amount</p>
            <p className="text-3xl md:text-4xl font-bold">₹{formatAmount(expense.amount)}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4">
          {expense.isSettled ? (
            <span className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Settled
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              <XCircle className="w-4 h-4" />
              Pending
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Paid By Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Paid By</h2>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={expense.paidBy.avatar || 'https://via.placeholder.com/48'}
                alt={expense.paidBy.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
              />
              <div>
                <p className="font-semibold text-slate-800">{expense.paidBy.name}</p>
                <p className="text-sm text-slate-500">{expense.paidBy.email}</p>
              </div>
            </div>
          </div>

          {/* Group Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Group</h2>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4">
              <p className="font-semibold text-slate-800">{expense.group.name}</p>
              <p className="text-sm text-slate-600 mt-1">
                {expense.group.members.length} {expense.group.members.length === 1 ? 'member' : 'members'}
              </p>
            </div>
          </div>

          {/* Split Type */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Split Details</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Split Type:</span>
                <span className="font-medium text-slate-800 capitalize">{expense.splitType.toLowerCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Currency:</span>
                <span className="font-medium text-slate-800">{expense.currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Split Among */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Split Among</h2>
            </div>
            <div className="space-y-3">
              {expense.splits.map((split) => (
                <div
                  key={split.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={split.user.avatar || 'https://via.placeholder.com/40'}
                      alt={split.user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                    />
                    <div>
                      <p className="font-medium text-slate-800">{split.user.name}</p>
                      {split.percentage && (
                        <p className="text-xs text-slate-500">{split.percentage}%</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">₹{formatAmount(split.amount)}</p>
                    {split.isSettled ? (
                      <span className="text-xs text-green-600 font-medium">Settled</span>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {expense.notes && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Notes</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">{expense.notes}</p>
            </div>
          )}

          {/* Tags */}
          {expense.tags && expense.tags.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 mb-4">
                <Tag className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Tags</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {expense.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Receipts */}
          {expense.receipts && expense.receipts.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 mb-4">
                <Receipt className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Receipts</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {expense.receipts.map((receipt, index) => (
                  <img
                    key={index}
                    src={receipt}
                    alt={`Receipt ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-slate-200 hover:scale-105 transition-transform cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metadata Footer */}
      <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          <div>
            <span className="font-medium">Created: </span>
            {formatDate(expense.createdAt)}
          </div>
          <div>
            <span className="font-medium">Last Updated: </span>
            {formatDate(expense.updatedAt)}
          </div>
          <div>
            <span className="font-medium">Expense ID: </span>
            {expense.id}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewExpense;