import { useState } from "react";

const FILTERS = ["all", "win", "loss", "pending"];

export default function BetList({ bets, onEdit, onDelete, onNewBet }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = bets
    .filter((b) => filter === "all" || b.outcome === filter)
    .filter((b) =>
      search === "" ||
      b.description?.toLowerCase().includes(search.toLowerCase()) ||
      b.opponent?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <div className="page-header">
        <div className="page-title">My Bets</div>
        <div className="page-sub">{bets.length} total bets recorded</div>
      </div>

      {/* Desktop toolbar */}
      <div className="betlist-toolbar-desktop">
        <input
          className="form-input"
          style={{ maxWidth: 260, marginBottom: 0 }}
          placeholder="Search bets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-bar" style={{ margin: 0 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "win" ? "✓ Wins" : f === "loss" ? "✗ Losses" : "⏳ Pending"}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile toolbar */}
      <div className="betlist-toolbar-mobile">
        <input
          className="form-input"
          placeholder="Search bets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-bar" style={{ margin: 0, flexWrap: "nowrap", overflowX: "auto", paddingBottom: 4 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
              style={{ flexShrink: 0 }}
            >
              {f === "all" ? "All" : f === "win" ? "✓ Wins" : f === "loss" ? "✗ Losses" : "⏳ Pending"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-text">No bets match your filter.</div>
        </div>
      ) : (
        <div className="bet-table">
          <div className="bet-table-header">
            <span>Description</span>
            <span>Opponent</span>
            <span>Stakes</span>
            <span>Outcome</span>
            <span></span>
          </div>
          {filtered.map((b) => (
            <BetRow key={b.id} bet={b} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

function BetRow({ bet, onEdit, onDelete }) {
  const date = new Date(bet.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="bet-row">
      <div>
        <div className="bet-desc">{bet.description}</div>
        <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2 }}>{date}</div>
        {bet.notes && <div style={{ fontSize: "0.78rem", color: "var(--muted2)", marginTop: 3 }}>{bet.notes}</div>}
      </div>
      <div className="bet-opponent bet-col-desktop">{bet.opponent || "—"}</div>
      <div className="bet-col-desktop" style={{ fontSize: "0.82rem" }}>
        <div style={{ color: "var(--loss)", marginBottom: 3 }}>
          <span style={{ color: "var(--muted)", fontSize: "0.72rem" }}>You give: </span>
          {bet.myStake || bet.amount ? (bet.myStake || `₹${parseFloat(bet.amount).toFixed(2)}`) : "—"}
        </div>
        <div style={{ color: "var(--win)" }}>
          <span style={{ color: "var(--muted)", fontSize: "0.72rem" }}>You get: </span>
          {bet.theirStake || "—"}
        </div>
      </div>
      <div className="bet-col-desktop">
        <span className={`badge badge-${bet.outcome}`}>
          {bet.outcome === "win" ? "✓ Won" : bet.outcome === "loss" ? "✗ Lost" : "⏳ Pending"}
        </span>
      </div>

      {/* Mobile only info */}
      <div className="bet-mobile-row">
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {bet.opponent && <span style={{ color: "var(--muted2)", fontSize: "0.8rem" }}>vs {bet.opponent}</span>}
          <span className={`badge badge-${bet.outcome}`}>
            {bet.outcome === "win" ? "✓ Won" : bet.outcome === "loss" ? "✗ Lost" : "⏳ Pending"}
          </span>
        </div>
        <div style={{ fontSize: "0.8rem", marginTop: 6, display: "flex", gap: 16 }}>
          {(bet.myStake || bet.amount) && (
            <span>
              <span style={{ color: "var(--muted)", fontSize: "0.72rem" }}>Give: </span>
              <span style={{ color: "var(--loss)" }}>{bet.myStake || `₹${parseFloat(bet.amount).toFixed(2)}`}</span>
            </span>
          )}
          {bet.theirStake && (
            <span>
              <span style={{ color: "var(--muted)", fontSize: "0.72rem" }}>Get: </span>
              <span style={{ color: "var(--win)" }}>{bet.theirStake}</span>
            </span>
          )}
        </div>
      </div>

      <div className="bet-actions">
        <button className="icon-btn" title="Edit" onClick={() => onEdit(bet)}>✏️</button>
        <button className="icon-btn del" title="Delete" onClick={() => {
          if (window.confirm("Delete this bet?")) onDelete(bet.id);
        }}>🗑️</button>
      </div>
    </div>
  );
}
