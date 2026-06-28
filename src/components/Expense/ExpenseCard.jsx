import React from "react";
import { Users, Calendar, DollarSign, Tag, Eye, Trash2, CheckCircle2, Clock } from "lucide-react";
import useExpenseStore from "@/stores/expenseStore";

// ── Inline styles via a <style> tag for font + keyframe imports ──────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .expense-card {
    font-family: 'DM Sans', sans-serif;
    animation: cardIn 0.45s ease both;
  }

  .expense-card:hover .card-shine {
    opacity: 1;
  }

  .amount-text {
    font-family: 'DM Serif Display', serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .delete-btn:hover {
    background: #fff1f0 !important;
    color: #cf1322 !important;
    border-color: #ffa39e !important;
  }

  .view-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(15,52,96,0.25) !important;
  }

  .tag-chip {
    background: linear-gradient(135deg, #e8f4fd, #dbeafe);
  }
`;

// ── Category color palette ───────────────────────────────────────────────────
const categoryColors = [
  { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534" },
  { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af" },
  { bg: "#fdf4ff", border: "#e9d5ff", text: "#6b21a8" },
  { bg: "#fff7ed", border: "#fed7aa", text: "#9a3412" },
  { bg: "#fefce8", border: "#fde68a", text: "#92400e" },
];

function hashColor(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return categoryColors[Math.abs(hash) % categoryColors.length];
}

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
  const groupColor = hashColor(expense.group?.name);

  return (
    <div
      className="expense-card"
      style={{
        animationDelay: `${index * 60}ms`,
        position: "relative",
        width: "100%",
        maxWidth: "360px",
        borderRadius: "20px",
        background: "#ffffff",
        border: "1px solid #e8eaf0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.8) inset",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.8) inset";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.8) inset";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Top accent strip */}
      <div style={{
        height: "3px",
        background: expense.isSettled
          ? "linear-gradient(90deg, #52c41a, #95de64)"
          : "linear-gradient(90deg, #0f3460, #533483)",
      }} />

      {/* Header */}
      <div style={{ padding: "18px 20px 12px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "18px",
              fontWeight: 400,
              color: "#111827",
              margin: 0,
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {expense.description}
            </h3>
            <p style={{
              margin: "4px 0 0",
              fontSize: "12px",
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}>
              <Calendar size={11} />
              {formatDate(expense.date)}
            </p>
          </div>

          {/* Status badge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.03em",
            flexShrink: 0,
            background: expense.isSettled ? "#f6ffed" : "#fff9e6",
            color: expense.isSettled ? "#389e0d" : "#d46b08",
            border: `1px solid ${expense.isSettled ? "#b7eb8f" : "#ffd591"}`,
          }}>
            {expense.isSettled
              ? <><CheckCircle2 size={11} /> Settled</>
              : <><Clock size={11} /> Pending</>}
          </div>
        </div>
      </div>

      {/* Amount block */}
      <div style={{ padding: "0 20px 14px" }}>
        <div style={{
          background: "linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)",
          borderRadius: "14px",
          padding: "14px 16px",
          border: "1px solid #e0e7ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <p style={{ margin: 0, fontSize: "11px", color: "#6b7280", fontWeight: 500, marginBottom: "2px" }}>
              Total Amount
            </p>
            <p className="amount-text" style={{ margin: 0, fontSize: "26px", lineHeight: 1.1 }}>
              {formatAmount(expense.amount, expense.currency)}
            </p>
          </div>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #0f3460, #533483)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <DollarSign size={20} color="white" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Info row */}
      <div style={{ padding: "0 20px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {[
          { label: "Paid By", value: expense.paidBy?.name || "Unknown" },
          { label: "Split Type", value: expense.splitType },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: "#f9fafb",
            borderRadius: "10px",
            padding: "10px 12px",
            border: "1px solid #f0f0f0",
          }}>
            <p style={{ margin: 0, fontSize: "10px", color: "#9ca3af", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {label}
            </p>
            <p style={{ margin: "3px 0 0", fontSize: "13px", fontWeight: 600, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Group + participants row */}
      <div style={{ padding: "0 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {expense.group && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 10px",
            borderRadius: "20px",
            background: groupColor.bg,
            border: `1px solid ${groupColor.border}`,
            maxWidth: "60%",
          }}>
            <Tag size={11} color={groupColor.text} />
            <span style={{
              fontSize: "12px",
              fontWeight: 600,
              color: groupColor.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {expense.group.name}
            </span>
          </div>
        )}

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "5px 10px",
          borderRadius: "20px",
          background: "#f3f4f6",
          border: "1px solid #e5e7eb",
          marginLeft: expense.group ? "auto" : 0,
        }}>
          <Users size={12} color="#6b7280" />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
            {expense.splits?.length || 0} {expense.splits?.length === 1 ? "person" : "people"}
          </span>
        </div>
      </div>

      {/* Notes */}
      {expense.notes && (
        <div style={{ padding: "0 20px 14px" }}>
          <div style={{
            background: "#fafafa",
            borderRadius: "10px",
            padding: "10px 12px",
            border: "1px solid #f0f0f0",
            borderLeft: "3px solid #c7d2fe",
          }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", lineHeight: 1.5,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {expense.notes}
            </p>
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: "1px", background: "#f3f4f6", margin: "0 20px" }} />

      {/* Actions */}
      <div style={{ padding: "12px 20px 16px", display: "flex", gap: "8px" }}>
        <button
          className="view-btn"
          onClick={() => onViewExpense(expense.id)}
          style={{
            flex: 1,
            height: "38px",
            border: "none",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #0f3460, #533483)",
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(15,52,96,0.18)",
          }}
        >
          <Eye size={14} />
          View Details
        </button>
        <button
          className="delete-btn"
          onClick={() => removeExpense(expense.id)}
          style={{
            flex: 1,
            height: "38px",
            border: "1.5px solid #e5e7eb",
            borderRadius: "12px",
            background: "white",
            color: "#6b7280",
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            transition: "all 0.2s ease",
          }}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export function ExpenseCards({ onViewExpense }) {
  const { expenses, removeExpense } = useExpenseStore();

  return (
    <>
      <style>{styles}</style>

      {!expenses || expenses.length === 0 ? (
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          textAlign: "center",
          color: "#9ca3af",
          padding: "48px 0",
          fontSize: "15px",
        }}>
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