import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import { db, auth } from "./firebase";
import "./AdminPanel.css";

export default function AdminPanel({ onExit }) {
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // checking session
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [filterSem, setFilterSem] = useState("all");
  const [sortField, setSortField] = useState("submittedAt");
  const [sortDir, setSortDir] = useState("desc");

  // ── listen to Firebase auth state (handles page refresh) ──────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthed(!!user);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // ── fetch data once authenticated ──────────────────────────────────────────
  useEffect(() => {
    if (!authed) return;
    fetchResponses();
  }, [authed]);

  async function fetchResponses() {
    setLoading(true);
    try {
      const q = query(
        collection(db, "responses"),
        orderBy("submittedAt", "desc")
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setResponses(data);
    } catch (err) {
      console.error("Error fetching responses:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {    if (!window.confirm("Delete this response? This cannot be undone.")) return;
    await deleteDoc(doc(db, "responses", id));
    setResponses((prev) => prev.filter((r) => r.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will set authed = true automatically
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setLoginError("Invalid email or password.");
          break;
        case "auth/invalid-email":
          setLoginError("Enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setLoginError("Too many attempts. Try again later.");
          break;
        default:
          setLoginError("Login failed. Check your connection.");
      }
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    setAuthed(false);
  }

  // ── checking auth session on load ─────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <div className="admin-login-tag">ADMIN ACCESS</div>
          <p style={{ color: "#555", fontFamily: "DM Mono, monospace", fontSize: "11px" }}>
            Checking session...
          </p>
        </div>
      </div>
    );
  }

  // ── login screen ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <div className="admin-login-tag">ADMIN ACCESS</div>
          <h1>BCA TECH<br /><span>COMMUNITY</span></h1>
          <p>Sign in with your Firebase admin account.</p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              autoComplete="email"
              onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
              className={loginError ? "error" : ""}
              required
            />
            <div className="pw-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                className={loginError ? "error" : ""}
                required
              />
              <button
                type="button"
                className="pw-eye"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {loginError && <div className="admin-login-error">{loginError}</div>}
            <button type="submit" disabled={loginLoading}>
              {loginLoading ? "SIGNING IN..." : "SIGN IN →"}
            </button>
          </form>

          <button className="back-btn" onClick={onExit}>
            ← Back to site
          </button>
        </div>
      </div>
    );
  }

  // ── filter + sort ──────────────────────────────────────────────────────────
  const filtered = responses
    .filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        r.name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.includes(q) ||
        r.year?.toLowerCase().includes(q);
      const matchYear = filterYear === "all" || r.year === filterYear;
      const matchSem  = filterSem  === "all" || r.semester === filterSem;
      return matchSearch && matchYear && matchSem;
    })
    .sort((a, b) => {
      let av = a[sortField];
      let bv = b[sortField];
      if (sortField === "submittedAt") {
        av = av?.seconds ?? 0;
        bv = bv?.seconds ?? 0;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  function toggleSort(field) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function formatDate(ts) {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function exportCSV() {
    const headers = [
      "Name", "Year", "Semester", "Skill Level",
      "Interests", "Activities", "Contributions",
      "Phone", "Email", "Submitted At",
    ];
    const rows = filtered.map((r) => [
      r.name ?? "",
      r.year ?? "",
      r.semester ?? "",
      r.skillLevel ?? "",
      (r.interests ?? []).join(" | "),
      (r.activities ?? []).join(" | "),
      (r.contributions ?? []).join(" | "),
      r.phone ?? "",
      r.email ?? "",
      formatDate(r.submittedAt),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bca-community-responses.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── detail modal (centered overlay) ──────────────────────────────────────
  const Detail = ({ r }) => (
    <div className="modal-overlay" onClick={() => setSelected(null)}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        {/* MODAL HEADER */}
        <div className="modal-header">
          <div className="modal-avatar">{r.name?.[0]?.toUpperCase()}</div>
          <div className="modal-title-block">
            <div className="modal-name">{r.name}</div>
            <div className="modal-sub">{r.email} &nbsp;·&nbsp; +91 {r.phone}</div>
          </div>
          <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
        </div>

        {/* INFO ROW */}
        <div className="modal-info-row">
          <InfoChip label="YEAR" value={r.year} />
          <InfoChip label="SEMESTER" value={r.semester} />
          <InfoChip label="SUBMITTED" value={formatDate(r.submittedAt)} />
        </div>

        {/* SKILL */}
        <div className="modal-section">
          <div className="modal-section-label">SKILL LEVEL</div>
          <div className="modal-skill-value">{r.skillLevel || "—"}</div>
        </div>

        {/* TAGS */}
        <TagBlock label="INTERESTS" items={r.interests} color="#d4f542" />
        <TagBlock label="ACTIVITIES" items={r.activities} color="#fff3b0" />
        <TagBlock label="CONTRIBUTIONS" items={r.contributions} color="#ffd6e7" />

        {/* DELETE */}
        <div className="modal-footer">
          <button className="btn-delete" onClick={() => handleDelete(r.id)}>
            🗑 DELETE RESPONSE
          </button>
        </div>

      </div>
    </div>
  );

  const InfoChip = ({ label, value }) => (
    <div className="info-chip">
      <div className="info-chip-label">{label}</div>
      <div className="info-chip-value">{value || "—"}</div>
    </div>
  );

  const TagBlock = ({ label, items = [], color, light }) => (
    <div className="tag-block">
      <div className="detail-label">{label}</div>
      <div className="tag-list">
        {items.length === 0
          ? <span className="tag-empty">None selected</span>
          : items.map((item) => (
            <span
              key={item}
              className="tag"
              style={{
                background: color,
                color: light ? "#fff" : "#111",
                border: `2px solid #111`,
              }}
            >
              {item}
            </span>
          ))}
      </div>
    </div>
  );

  // ── main dashboard ─────────────────────────────────────────────────────────
  return (
    <div className="admin-shell">

      {/* CENTERED MODAL */}
      {selected && <Detail r={selected} />}

      {/* MAIN PANEL */}
      <div className="admin-main">

        {/* TOPBAR */}
        <div className="admin-topbar">
          <div className="admin-brand">
            <span>BCA TECH COMMUNITY</span>
            <span className="admin-badge">ADMIN</span>
          </div>
          <div className="admin-topbar-right">
            <button className="btn-refresh" onClick={fetchResponses}>↻ REFRESH</button>
            <button className="btn-export" onClick={exportCSV}>↓ EXPORT CSV</button>
            <button className="btn-exit" onClick={handleLogout}>↩ SIGN OUT</button>
            <button className="btn-exit" onClick={onExit}>← EXIT ADMIN</button>
          </div>
        </div>

        {/* STATS */}
        <div className="admin-stats">
          <StatCard label="TOTAL RESPONSES" value={responses.length} />
          <StatCard
            label="THIS MONTH"
            value={responses.filter((r) => {
              if (!r.submittedAt) return false;
              const d = r.submittedAt.toDate ? r.submittedAt.toDate() : new Date(r.submittedAt);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
          />
          <StatCard
            label="1ST YEAR"
            value={responses.filter((r) => r.year === "1st year").length}
          />
          <StatCard
            label="2ND YEAR"
            value={responses.filter((r) => r.year === "2nd year").length}
          />
          <StatCard
            label="3RD YEAR"
            value={responses.filter((r) => r.year === "3rd year").length}
          />
        </div>

        {/* SEARCH + FILTERS */}
        <div className="admin-search-bar">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* YEAR FILTER */}
          <select
            value={filterYear}
            onChange={(e) => { setFilterYear(e.target.value); setFilterSem("all"); }}
            className="filter-select"
          >
            <option value="all">ALL YEARS</option>
            <option value="1st year">1ST YEAR</option>
            <option value="2nd year">2ND YEAR</option>
            <option value="3rd year">3RD YEAR</option>
          </select>

          {/* SEMESTER FILTER — updates based on year */}
          <select
            value={filterSem}
            onChange={(e) => setFilterSem(e.target.value)}
            className="filter-select"
            disabled={filterYear === "all"}
          >
            <option value="all">ALL SEMS</option>
            {filterYear === "1st year" && <>
              <option value="Semester 1">SEM 1</option>
              <option value="Semester 2">SEM 2</option>
            </>}
            {filterYear === "2nd year" && <>
              <option value="Semester 3">SEM 3</option>
              <option value="Semester 4">SEM 4</option>
            </>}
            {filterYear === "3rd year" && <>
              <option value="Semester 5">SEM 5</option>
              <option value="Semester 6">SEM 6</option>
            </>}
          </select>

          {/* CLEAR FILTERS */}
          {(filterYear !== "all" || filterSem !== "all" || search) && (
            <button
              className="btn-clear"
              onClick={() => { setFilterYear("all"); setFilterSem("all"); setSearch(""); }}
            >
              ✕ CLEAR
            </button>
          )}

          <span className="search-count">{filtered.length} RESULTS</span>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="admin-loading">Loading responses...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">No responses found.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <Th label="NAME" field="name" sortField={sortField} sortDir={sortDir} onSort={toggleSort} />
                  <Th label="YEAR" field="year" sortField={sortField} sortDir={sortDir} onSort={toggleSort} />
                  <Th label="SEMESTER" field="semester" sortField={sortField} sortDir={sortDir} onSort={toggleSort} />
                  <th>PHONE</th>
                  <th>EMAIL</th>
                  <Th label="SUBMITTED" field="submittedAt" sortField={sortField} sortDir={sortDir} onSort={toggleSort} />
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className={selected?.id === r.id ? "active-row" : ""}
                    onClick={() => setSelected(r)}
                  >
                    <td><strong>{r.name}</strong></td>
                    <td>{r.year}</td>
                    <td>{r.semester}</td>
                    <td>+91 {r.phone}</td>
                    <td>{r.email}</td>
                    <td className="mono">{formatDate(r.submittedAt)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn-view"
                        onClick={() => setSelected(r)}
                      >
                        VIEW
                      </button>
                      <button
                        className="btn-del-sm"
                        onClick={() => handleDelete(r.id)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Th({ label, field, sortField, sortDir, onSort }) {
  const active = sortField === field;
  return (
    <th className={`sortable ${active ? "sorted" : ""}`} onClick={() => onSort(field)}>
      {label} {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </th>
  );
}
