import React from "react";
import { Users, Calendar, Tag, Eye, Trash2, CheckCircle2, Clock } from "lucide-react";
import useExpenseStore from "@/stores/expenseStore";

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatAmount = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

// ── Card ─────────────────────────────────────────────────────────────────────
function ExpenseCard({ expense, onViewExpense, removeExpense, index }) {
  return (
    <div
      className="bg-card border border-border shadow-xs hover:shadow-md rounded-2xl overflow-hidden hover:-translate-y-0.5 transition-all duration-200 w-full max-w-[360px] flex flex-col justify-between"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div>
        {/* Top accent strip */}
        <div className={`h-1 bg-gradient-to-r ${
          expense.isSettled 
            ? "from-emerald-500 to-emerald-600" 
            : "from-orange-500 to-orange-600"
        }`} />

        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between gap-2.5">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-foreground truncate" title={expense.description}>
                {expense.description}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                <Calendar size={10} />
                {formatDate(expense.date)}
              </p>
            </div>

            {/* Status badge */}
            <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide shrink-0 border ${
              expense.isSettled
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
            }`}>
              {expense.isSettled ? (
                <><CheckCircle2 size={10} /> Settled</>
              ) : (
                <><Clock size={10} /> Pending</>
              )}
            </div>
          </div>
        </div>

        {/* Amount block */}
        <div className="px-4 pb-3">
          <div className="bg-muted/30 border border-border rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase font-semibold tracking-wider text-muted-foreground mb-0.5">
                Total Amount
              </p>
              <p className="text-xl font-bold text-foreground tracking-tight">
                {formatAmount(expense.amount, expense.currency)}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
              <span className="font-bold text-sm text-orange-600 dark:text-orange-400">₹</span>
            </div>
          </div>
        </div>

        {/* Info row */}
        <div className="px-4 pb-3 grid grid-cols-2 gap-2">
          {[
            { label: "Paid By", value: expense.paidBy?.name || "Unknown" },
            { label: "Split Type", value: expense.splitType },
          ].map(({ label, value }) => (
            <div key={label} className="bg-muted/10 border border-border/80 rounded-xl p-2.5 min-w-0">
              <p className="text-[9px] text-muted-foreground uppercase font-semibold tracking-wider">
                {label}
              </p>
              <p className="text-xs font-bold text-foreground truncate mt-0.5">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Group + participants row */}
        <div className="px-4 pb-3 flex items-center justify-between">
          {expense.group && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted border border-border max-w-[60%]">
              <Tag size={10} className="text-muted-foreground shrink-0" />
              <span className="text-[10px] font-bold text-muted-foreground truncate">
                {expense.group.name}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted border border-border ml-auto shrink-0">
            <Users size={10} className="text-muted-foreground shrink-0" />
            <span className="text-[10px] font-bold text-muted-foreground">
              {expense.splits?.length || 0} {expense.splits?.length === 1 ? "person" : "people"}
            </span>
          </div>
        </div>

        {/* Notes */}
        {expense.notes && (
          <div className="px-4 pb-3">
            <div className="bg-muted/15 border-l-2 border-orange-500/50 rounded-r-lg p-2 text-[10px] text-muted-foreground leading-relaxed truncate">
              {expense.notes}
            </div>
          </div>
        )}
      </div>

      <div>
        {/* Divider */}
        <div className="h-[1px] bg-border mx-4" />

        {/* Actions */}
        <div className="p-3 flex gap-2">
          <button
            className="flex-1 h-8 rounded-lg bg-foreground text-background hover:bg-foreground/90 text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            onClick={() => onViewExpense(expense.id)}
          >
            <Eye size={12} />
            View Details
          </button>
          <button
            className="flex-1 h-8 rounded-lg border border-border bg-card hover:bg-accent text-foreground text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            onClick={() => removeExpense(expense.id)}
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export function ExpenseCards({ onViewExpense }) {
  const { expenses, removeExpense } = useExpenseStore();

  return (
    <>
      {!expenses || expenses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-xs col-span-full">
          No expenses yet — add one to get started.
        </div>
      ) : (
        expenses.map((expense, index) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            index={index}
            onViewExpense={onViewExpense}
            removeExpense={removeExpense}
          />
        ))
      )}
    </>
  );
}