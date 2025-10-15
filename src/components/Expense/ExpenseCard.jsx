import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Calendar, DollarSign, Tag } from "lucide-react";
import useExpenseStore from "@/stores/expenseStore";

export function ExpenseCards({  onViewExpense }) {

    const { expenses,removeExpense } = useExpenseStore();
  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center text-slate-500 py-8">
        No Expenses Found
      </div>
    );
  }

  


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      {expenses.map((expense) => (
        <Card
          key={expense.id}
          className="w-full max-w-sm rounded-2xl shadow-lg bg-white border border-slate-200/60 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-bold text-slate-900 truncate">
                  {expense.description}
                </CardTitle>
                <CardDescription className="text-slate-500 mt-0.5 text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(expense.date)}
                </CardDescription>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-semibold shrink-0 ${
                  expense.isSettled
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-amber-100 text-amber-700 border border-amber-200"
                }`}
              >
                {expense.isSettled ? "Settled" : "Pending"}
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-2.5 px-5">
            {/* Amount Section */}
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-3 border border-blue-200/50 mb-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-600 mb-0.5">
                    Total Amount
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    {formatAmount(expense.amount, expense.currency)}
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600/20" />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/50">
                <div className="text-xs font-medium text-slate-500 mb-0.5">
                  Paid By
                </div>
                <div className="text-sm font-bold text-slate-900 truncate">
                  {expense.paidBy?.name || "Unknown"}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/50">
                <div className="text-xs font-medium text-slate-500 mb-0.5">
                  Split Type
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {expense.splitType}
                </div>
              </div>
            </div>

            {/* Group & Splits Info */}
            <div className="mt-2.5 flex items-center justify-between text-xs">
              {expense.group && (
                <div className="flex items-center gap-1 text-slate-600">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="font-medium truncate max-w-[120px]">
                    {expense.group.name}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
                <Users className="w-3.5 h-3.5 text-slate-600" />
                <span className="font-semibold text-slate-700">
                  {expense.splits?.length || 0}
                </span>
              </div>
            </div>

            {/* Notes Preview */}
            {expense.notes && (
              <div className="mt-2.5 bg-slate-50 rounded-lg p-2 border border-slate-200/50">
                <div className="text-xs text-slate-600 line-clamp-2">
                  {expense.notes}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex gap-2 pt-2 pb-4 px-5">
            <Button
              type="button"
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-md transition-all duration-300 h-9 text-sm"
              onClick={() => onViewExpense(expense.id)}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              onClick={() => removeExpense(expense.id)}
              className="flex-1 border-2 border-slate-200 text-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 font-semibold rounded-xl transition-all duration-300 h-9 text-sm"
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}