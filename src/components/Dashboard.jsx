export default function Dashboard({ bets }) {
  const total = bets.length;
  const wins = bets.filter((b) => b.outcome === "win").length;
  const losses = bets.filter((b) => b.outcome === "loss").length;
  const pending = bets.filter((b) => b.outcome === "pending").length;
  const winRate = total > 0 ? Math.round((wins / (wins + losses || 1)) * 100) : 0;
  const recent = [...bets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-sub">Your betting performance at a glance</div>
      </div>

      <div className="stat-grid">
        <div className="stat-card yellow">
          <div className="stat-label">Total Bets</div>
          <div className="stat-value">{total}</div>
          <div className="stat-sub">{pending} pending</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Wins</div>
          <div className="stat-value">{wins}</div>
          <div className="stat-sub">{winRate}% win rate</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Losses</div>
          <div className="stat-value">{losses}</div>
          <div className="stat-sub">vs {wins} wins</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{pending}</div>
          <div className="stat-sub">awaiting outcome</div>
        </div>
      </div>

      <div className="section-header">
        <div className="section-title">Recent Bets</div>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <div className="empty-text">No bets yet. Add your first one from the sidebar!</div>
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
          {recent.map((b) => (
            <BetRowSimple key={b.id} bet={b} />
          ))}
        </div>
      )}
    </div>
  );
}

function BetRowSimple({ bet }) {
  const date = new Date(bet.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return (
    <div className="bet-row">
      <div>
        <div className="bet-desc">{bet.description}</div>
        <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2 }}>{date}</div>
      </div>
      <div className="bet-opponent bet-col-desktop">{bet.opponent || "—"}</div>
      <div className="bet-col-desktop" style={{ fontSize: "0.82rem" }}>
        <div style={{ color: "var(--loss)", marginBottom: 3 }}>
          <span style={{ color: "var(--muted)", fontSize: "0.72rem" }}>Give: </span>
          {bet.myStake || (bet.amount ? `₹${parseFloat(bet.amount).toFixed(2)}` : "—")}
        </div>
        <div style={{ color: "var(--win)" }}>
          <span style={{ color: "var(--muted)", fontSize: "0.72rem" }}>Get: </span>
          {bet.theirStake || "—"}
        </div>
      </div>
      <div className="bet-col-desktop">
        <span className={`badge badge-${bet.outcome}`}>
          {bet.outcome === "win" ? "✓ Won" : bet.outcome === "loss" ? "✗ Lost" : "⏳ Pending"}
        </span>
      </div>
      <div className="bet-mobile-row">
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {bet.opponent && <span style={{ color: "var(--muted2)", fontSize: "0.8rem" }}>vs {bet.opponent}</span>}
          <span className={`badge badge-${bet.outcome}`}>
            {bet.outcome === "win" ? "✓ Won" : bet.outcome === "loss" ? "✗ Lost" : "⏳ Pending"}
          </span>
        </div>
      </div>
      <div></div>
    </div>
  );
}
