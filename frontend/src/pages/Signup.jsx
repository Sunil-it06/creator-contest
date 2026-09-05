import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userApi from "../api/userApi";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      await userApi.post("/auth/signup", form);

      alert("Signup successful. Please login.");

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <div className="container">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
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
          minLength={6}
        />

        <button type="submit">
          Signup
        </button>

        {error && <p className="error">{error}</p>}
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;