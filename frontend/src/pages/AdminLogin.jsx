
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

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
          "Invalid admin email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">

      <div className="admin-auth-card">

        {/* =====================================
            LEFT BRANDING
        ====================================== */}

        <div className="admin-auth-brand">

          <div className="admin-auth-brand-content">

            <div className="admin-auth-logo">
              CC
            </div>

            <div className="admin-auth-label">
              ADMIN PORTAL
            </div>

            <h1>
              Creator Contest
              <span> Admin</span>
            </h1>

            <p>
              Manage contest rankings, winners,
              prizes and KYC verification from one
              secure dashboard.
            </p>

            <div className="admin-auth-features">

              <div className="admin-auth-feature">
                <span>✓</span>
                <p>Manage contest rankings</p>
              </div>

              <div className="admin-auth-feature">
                <span>✓</span>
                <p>Manage prize allocation</p>
              </div>

              <div className="admin-auth-feature">
                <span>✓</span>
                <p>Review winner KYC</p>
              </div>

              <div className="admin-auth-feature">
                <span>✓</span>
                <p>Monitor contest performance</p>
              </div>

            </div>

          </div>

          <div className="admin-auth-brand-footer">
            Creator Contest Platform
          </div>

        </div>


        {/* =====================================
            LOGIN SECTION
        ====================================== */}

        <div className="admin-auth-form-area">

          <div className="admin-auth-card-header">

            <div className="admin-auth-secure-icon">
              🔐
            </div>

            <div>
              <h2>Welcome back</h2>

              <p>
                Sign in to access the admin dashboard.
              </p>
            </div>

          </div>


          <form
            className="admin-auth-form"
            onSubmit={handleSubmit}
          >

            {/* Email */}

            <div className="admin-auth-field">

              <label htmlFor="admin-email">
                Email address
              </label>

              <div className="admin-auth-input-wrapper">

                <span className="admin-auth-input-icon">
                  ✉
                </span>

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* Password */}

            <div className="admin-auth-field">

              <label htmlFor="admin-password">
                Password
              </label>

              <div className="admin-auth-input-wrapper">

                <span className="admin-auth-input-icon">
                  🔒
                </span>

                <input
                  id="admin-password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="admin-auth-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* Error */}

            {error && (
              <div className="admin-auth-error">

                <span>!</span>

                <p>{error}</p>

              </div>
            )}


            {/* Login */}

            <button
              type="submit"
              className="admin-auth-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="admin-auth-spinner" />
                  Signing in...
                </>
              ) : (
                "Sign in to dashboard"
              )}

            </button>

          </form>


          {/* Security */}

          <div className="admin-auth-security">

            <span>🛡️</span>

            <div>
              <strong>Secure administrator access</strong>

              <p>
                Only authorized administrators can access
                this dashboard.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;

