import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import IssueDetails from "./components/IssueDetails";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  // 🔥 GLOBAL STATE
  const [orgs, setOrgs] = useState([]);
  useEffect(() => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (token && savedUser) {
    setUser(JSON.parse(savedUser));
  }
}, []);

  // 🔐 AUTH FLOW
  if (!user) {
    return isLogin ? (
      <Login
        setUser={setUser}
        switchToRegister={() => setIsLogin(false)}
      />
    ) : (
      <Register switchToLogin={() => setIsLogin(true)} />
    );
  }

  // 🚀 ROUTING AFTER LOGIN
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ MAIN DASHBOARD */}
        <Route
          path="/"
          element={
            <Dashboard
              user={user}
              logout={() => setUser(null)}
              orgs={orgs}
              setOrgs={setOrgs}
            />
          }
        />

        {/* ✅ ISSUE DETAILS */}
        <Route
          path="/issue/:id"
          element={
            <IssueDetails
              user={user}
              orgs={orgs}
            />
          }
        />

        {/* 🔥 ADMIN ROUTE (THIS WAS MISSING) */}
        <Route
          path="/admin"
          element={
            user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <p style={{ padding: "20px" }}>Access Denied</p>
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;