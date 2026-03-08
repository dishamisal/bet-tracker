import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  BarChart, Bar,
} from "recharts";

const WIN_COLOR = "#3ecf8e";
const LOSS_COLOR = "#ff5c5c";
const PENDING_COLOR = "#7c8bff";
const ACCENT = "#f0c040";

export default function Charts({ bets }) {
  const wins = bets.filter((b) => b.outcome === "win").length;
  const losses = bets.filter((b) => b.outcome === "loss").length;
  const pending = bets.filter((b) => b.outcome === "pending").length;

  const pieData = [
    { name: "Wins", value: wins },
    { name: "Losses", value: losses },
    { name: "Pending", value: pending },
  ].filter((d) => d.value > 0);

  // Cumulative profit over time
  const sorted = [...bets]
    .filter((b) => b.outcome !== "pending")
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  let running = 0;
  const profitLine = sorted.map((b) => {
    running += b.outcome === "win" ? parseFloat(b.amount) : -parseFloat(b.amount);
    return {
      name: new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      profit: parseFloat(running.toFixed(2)),
    };
  });

  // Monthly bar chart
  const monthly = {};
  bets.forEach((b) => {
    const key = new Date(b.createdAt).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    if (!monthly[key]) monthly[key] = { month: key, wins: 0, losses: 0 };
    if (b.outcome === "win") monthly[key].wins++;
    if (b.outcome === "loss") monthly[key].losses++;
  });
  const barData = Object.values(monthly).slice(-6);

  const tooltipStyle = {
    backgroundColor: "#1a1d27",
    border: "1px solid #2a2d3e",
    borderRadius: "10px",
    color: "#eceef5",
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.82rem",
  };

  if (bets.length === 0) {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">Stats</div>
          <div className="page-sub">Charts will appear once you add bets</div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <div className="empty-text">No data yet — add some bets to see your stats!</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Stats</div>
        <div className="page-sub">Visual breakdown of your betting history</div>
      </div>

      <div className="charts-grid">
        {/* Pie chart */}
        <div className="chart-card">
          <div className="chart-title">Win / Loss Split</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.name === "Wins" ? WIN_COLOR : entry.name === "Losses" ? LOSS_COLOR : PENDING_COLOR} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "8px" }}>
            {pieData.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--muted2)" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: d.name === "Wins" ? WIN_COLOR : d.name === "Losses" ? LOSS_COLOR : PENDING_COLOR, display: "inline-block" }} />
                {d.name}: {d.value}
              </div>
            ))}
          </div>
        </div>

        {/* Monthly bar */}
        <div className="chart-card">
          <div className="chart-title">Monthly Wins vs Losses</div>
          {barData.length === 0 ? (
            <div style={{ color: "var(--muted)", fontSize: "0.85rem", paddingTop: 60, textAlign: "center" }}>No settled bets yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
                <XAxis dataKey="month" tick={{ fill: "#6b708a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b708a", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="wins" name="Wins" fill={WIN_COLOR} radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" name="Losses" fill={LOSS_COLOR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Profit line — full width */}
        <div className="chart-card wide">
          <div className="chart-title">Cumulative Profit Over Time</div>
          {profitLine.length < 2 ? (
            <div style={{ color: "var(--muted)", fontSize: "0.85rem", paddingTop: 60, textAlign: "center" }}>Need at least 2 settled bets to show trend</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={profitLine}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
                <XAxis dataKey="name" tick={{ fill: "#6b708a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b708a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₹${v}`, "Profit"]} />
                <Line type="monotone" dataKey="profit" stroke={ACCENT} strokeWidth={2.5} dot={{ fill: ACCENT, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
