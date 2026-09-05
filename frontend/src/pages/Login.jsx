import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userApi from "../api/userApi";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await userApi.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("userToken", response.data.token);

      navigate("/feed");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Creator Contest</h1>
        <p>Login to continue</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/signup">Signup</Link>
        </p>

        <Link to="/admin/login">
          Admin Login
        </Link>
      </div>
    </div>
  );
}

export default Login;