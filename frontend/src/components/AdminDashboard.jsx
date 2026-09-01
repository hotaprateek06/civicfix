import { useEffect, useState } from "react";
import { getAdminStats } from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    // ✅ Load stats
    getAdminStats().then(setStats);

    // ✅ Load analytics
    fetch("http://127.0.0.1:8000/admin/analytics")
      .then(res => res.json())
      .then(data => {
        const formatted = Object.keys(data).map(key => ({
          org: `Org ${key}`,
          issues: data[key]
        }));
        setAnalytics(formatted);
      });
  }, []);

  if (!stats) return <p>Loading...</p>;
  const orgData = Object.entries(stats.orgs || {}).map(([name, count]) => ({
  name,
  count,
}));
  return (

  <div className="container">
    <h2 style={{ marginBottom: "20px" }}>Admin Dashboard</h2>

    {/* STATS GRID */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "15px"
    }}>
      <div className="card"><h3>{stats.total}</h3><p>Total Issues</p></div>
      <div className="card"><h3>{stats.pending}</h3><p>Pending</p></div>
      <div className="card"><h3>{stats.in_progress}</h3><p>In Progress</p></div>
      <div className="card"><h3>{stats.resolved}</h3><p>Resolved</p></div>
      <div className="card"><h3>{stats.resolved_percent}%</h3><p>Resolved %</p></div>
    </div>

    {/* CHART SECTION */}
    <div className="card" style={{ marginTop: "30px" }}>
      <h3>Issues per Organization</h3>
      <BarChart width={500} height={300} data={orgData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" />
      </BarChart>
    </div>
  </div>
);
}

export default AdminDashboard;