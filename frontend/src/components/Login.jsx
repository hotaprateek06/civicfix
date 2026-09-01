import { useState } from "react";
import { loginUser } from "../api";

function Login({ setUser, switchToRegister }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const res = await loginUser(form); // ✅ FIXED

    if (res.access_token) {
      // ✅ STORE TOKEN
      localStorage.setItem("token", res.access_token);

      // ✅ STORE USER
      localStorage.setItem("user", JSON.stringify(res.user));

      setUser(res.user);
    } else {
      alert(res.error || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 style={{ marginBottom: "10px" }}>CivicFix</h1>
        <h2>Login</h2>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button onClick={handleLogin}>Login</button>

        <button className="toggle-btn" onClick={switchToRegister}>
          Don’t have an account? Register
        </button>
      </div>
    </div>
  );
}

export default Login;