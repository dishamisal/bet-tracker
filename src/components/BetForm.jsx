import { useState } from "react";

const empty = {
  description: "",
  opponent: "",
  myStake: "",
  theirStake: "",
  outcome: "pending",
  notes: "",
};

export default function BetForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || empty);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.description.trim()) return alert("Please enter a description.");
    if (!form.myStake.trim()) return alert("Please enter what you're putting up.");
    if (!form.theirStake.trim()) return alert("Please enter what your opponent is putting up.");
    onSave({ ...form });
  };

  return (
    <div className="modal">
      <div className="modal-title">{initial ? "Edit Bet" : "New Bet"}</div>

      <div className="form-group">
        <label className="form-label">What's the bet?</label>
        <input
          className="form-input"
          placeholder="e.g. India wins the match"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Opponent</label>
          <input
            className="form-input"
            placeholder="e.g. Rahul"
            value={form.opponent}
            onChange={(e) => set("opponent", e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">If you lose, you give...</label>
          <input
            className="form-input"
            placeholder="e.g. Lunch from their fav place"
            value={form.myStake}
            onChange={(e) => set("myStake", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">If you win, you get...</label>
          <input
            className="form-input"
            placeholder="e.g. 1hr board game time"
            value={form.theirStake}
            onChange={(e) => set("theirStake", e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Outcome</label>
        <select
          className="form-select"
          value={form.outcome}
          onChange={(e) => set("outcome", e.target.value)}
        >
          <option value="pending">⏳ Pending</option>
          <option value="win">✓ Won</option>
          <option value="loss">✗ Lost</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Notes (optional)</label>
        <textarea
          className="form-textarea"
          placeholder="Any extra details..."
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>

      <div className="modal-actions">
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button className="save-btn" onClick={handleSave}>
          {initial ? "Save Changes" : "Add Bet"}
        </button>
      </div>
    </div>
  );
}
