import { useState } from "react";
import { registerUser } from "../api";

function Register({ switchToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    city: "",
    type: "",
  });

  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "city" || e.target.name === "type") {
      value = value.toLowerCase(); // ✅ IMPORTANT
    }

    setForm({ ...form, [e.target.name]: value });
  };

  const handleRegister = async () => {
    if (form.role === "organization") {
      if (!form.city || !form.type) {
        alert("Organization must provide city and category");
        return;
      }
    }

    const res = await registerUser(form);
    alert(res.message || res.error);

    setForm({
      name: "",
      email: "",
      password: "",
      role: "user",
      city: "",
      type: "",
    });

    switchToLogin();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>CivicFix</h1>
        <h2>Register</h2>

        <input name="name" value={form.name} placeholder="Name" onChange={handleChange} />
        <input name="email" value={form.email} placeholder="Email" onChange={handleChange} />
        <input name="password" value={form.password} type="password" placeholder="Password" onChange={handleChange} />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="organization">Organization</option>
          <option value="admin">Admin</option>
        </select>

        {form.role === "organization" && (
          <>
            <input
              name="city"
              value={form.city}
              placeholder="Enter City (e.g. Sambalpur)"
              onChange={handleChange}
            />

            <select name="type" value={form.type} onChange={handleChange}>
              <option value="">Select Category</option>
              <option value="electric">Electric</option>
              <option value="water">Water</option>
              <option value="road">Road</option>
            </select>
          </>
        )}

        <button onClick={handleRegister}>Register</button>

        <button onClick={switchToLogin}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Register;