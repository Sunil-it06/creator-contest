import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../api/adminApi";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await adminApi.post(
        "/admin/auth/login",
        form
      );

      localStorage.setItem(
        "adminToken",
        response.data.token
      );

      navigate("/admin/winners");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Admin login failed"
      );
    }
  };

  return (
    <div className="container">
      <h2>Admin Login</h2>

      <form
        onSubmit={handleSubmit}
        className="form"
      >
        <input
          name="email"
          type="email"
          placeholder="Admin email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Login
        </button>

        {error && (
          <p className="error">{error}</p>
        )}
      </form>
    </div>
  );
}

export default AdminLogin;