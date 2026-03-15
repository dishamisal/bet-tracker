import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import Dashboard from "./components/Dashboard";
import BetList from "./components/BetList";
import BetForm from "./components/BetForm";
import Charts from "./components/Charts";
import Leaderboard from "./components/Leaderboard";
import "./App.css";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⚡" },
  { id: "bets", label: "My Bets", icon: "🎯" },
  { id: "charts", label: "Stats", icon: "📊" },
  { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBet, setEditBet] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "bets"), (snapshot) => {
      const data = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBets(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addBet = async (bet) => {
    await addDoc(collection(db, "bets"), {
      ...bet,
      createdAt: new Date().toISOString(),
    });
    setShowForm(false);
  };

  const updateBet = async (updated) => {
    const { id, ...data } = updated;
    await updateDoc(doc(db, "bets", id), data);
    setEditBet(null);
    setShowForm(false);
  };

  const deleteBet = async (id) => {
    await deleteDoc(doc(db, "bets", id));
  };

  const openEdit = (bet) => {
    setEditBet(bet);
    setShowForm(true);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🎲</span>
          <span className="brand-name">BetLog</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => setPage(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </button>
          ))}
        </nav>
        <button className="add-bet-btn" onClick={() => { setEditBet(null); setShowForm(true); }}>
          <span>+</span> <span className="add-bet-btn-text">New Bet</span>
        </button>
      </aside>

      <main className="main-content">
        <div className="page-wrap">
          {loading ? (
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <div className="empty-text">Loading bets...</div>
            </div>
          ) : (
            <>
              {page === "dashboard" && <Dashboard bets={bets} onNewBet={() => { setEditBet(null); setShowForm(true); }} />}
              {page === "bets" && <BetList bets={bets} onEdit={openEdit} onDelete={deleteBet} onNewBet={() => { setEditBet(null); setShowForm(true); }} />}
              {page === "charts" && <Charts bets={bets} />}
              {page === "leaderboard" && <Leaderboard bets={bets} />}
            </>
          )}
        </div>
      </main>

      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <BetForm
            initial={editBet}
            onSave={editBet ? updateBet : addBet}
            onCancel={() => { setShowForm(false); setEditBet(null); }}
          />
        </div>
      )}
    </div>
  );
}
