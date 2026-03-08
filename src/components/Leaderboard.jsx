export default function Leaderboard({ bets }) {
  // For now, just the current user. Easy to expand later.
  const wins = bets.filter((b) => b.outcome === "win").length;
  const losses = bets.filter((b) => b.outcome === "loss").length;
  const total = wins + losses;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  const profit = bets.reduce((acc, b) => {
    if (b.outcome === "win") return acc + parseFloat(b.amount || 0);
    if (b.outcome === "loss") return acc - parseFloat(b.amount || 0);
    return acc;
  }, 0);

  // Placeholder friends (greyed out — coming soon)
  const players = [
    { name: "You", emoji: "🧑", wins, losses, profit, winRate, isYou: true },
    { name: "Add a friend →", emoji: "➕", wins: "?", losses: "?", profit: null, winRate: "?", isYou: false, placeholder: true },
  ];

  const sorted = [...players].sort((a, b) => {
    if (a.placeholder) return 1;
    if (b.placeholder) return -1;
    return b.profit - a.profit;
  });

  const fmt = (n) => {
    if (n === null) return "—";
    const abs = Math.abs(n).toFixed(2);
    return (n >= 0 ? "+" : "-") + "₹" + abs;
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Leaderboard</div>
        <div className="page-sub">Compete with friends — invite them to track their bets too</div>
      </div>

      <div className="leaderboard-list">
        {sorted.map((p, i) => (
          <div key={p.name} className={`lb-row ${i === 0 && !p.placeholder ? "top" : ""} ${p.placeholder ? "placeholder" : ""}`}
            style={p.placeholder ? { opacity: 0.45, cursor: "default" } : {}}>
            <div className="lb-rank">
              {p.placeholder ? "—" : i === 0 ? "🥇" : i === 1 ? "🥈" : i + 1}
            </div>
            <div className="lb-avatar">{p.emoji}</div>
            <div className="lb-info">
              <div className="lb-name">
                {p.name}
                {p.isYou && (
                  <span style={{ marginLeft: 8, fontSize: "0.7rem", background: "rgba(240,192,64,0.15)", color: "var(--accent)", padding: "2px 8px", borderRadius: 20, fontFamily: "DM Mono, monospace" }}>
                    YOU
                  </span>
                )}
              </div>
              <div className="lb-meta">
                {p.placeholder
                  ? "Share BetLog with a friend"
                  : `${p.wins}W · ${p.losses}L · ${p.winRate}% win rate`}
              </div>
            </div>
            <div className={`lb-profit ${p.profit === null ? "zero" : p.profit > 0 ? "pos" : p.profit < 0 ? "neg" : "zero"}`}>
              {fmt(p.profit)}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 24,
        background: "var(--card)",
        border: "1px dashed var(--border2)",
        borderRadius: 14,
        padding: "20px 24px",
        color: "var(--muted)",
        fontSize: "0.85rem",
        lineHeight: 1.6
      }}>
        <strong style={{ color: "var(--text)", display: "block", marginBottom: 6 }}>🚧 Multiplayer coming soon</strong>
        In the next version, friends can join with their own profiles and everyone's stats will show here in real time. For now, keep tracking your own bets and you'll have a head start!
      </div>
    </div>
  );
}
