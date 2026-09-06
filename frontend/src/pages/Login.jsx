
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userApi from "../api/userApi";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

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
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-auth-page">

      <div className="user-auth-card">

        {/* =====================================
            LEFT BRANDING
        ====================================== */}

        <div className="user-auth-brand">

          <div className="user-auth-brand-content">

            <div className="user-auth-logo">
              CC
            </div>

            <h1>Creator Contest</h1>

            <p className="user-auth-brand-description">
              Showcase your creativity, compete with
              talented creators and earn recognition.
            </p>

            <div className="user-auth-features">

              <div className="user-auth-feature">
                <span className="user-auth-feature-icon">
                  ✓
                </span>

                <span>
                  Share your creative content
                </span>
              </div>

              <div className="user-auth-feature">
                <span className="user-auth-feature-icon">
                  ✓
                </span>

                <span>
                  Compete across categories
                </span>
              </div>

              <div className="user-auth-feature">
                <span className="user-auth-feature-icon">
                  ✓
                </span>

                <span>
                  Climb the creator rankings
                </span>
              </div>

              <div className="user-auth-feature">
                <span className="user-auth-feature-icon">
                  ✓
                </span>

                <span>
                  Get a chance to win prizes
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* =====================================
            LOGIN FORM
        ====================================== */}

        <div className="user-auth-form-area">

          <div className="user-auth-header">

            <h2>Welcome back</h2>

            <p>
              Sign in to continue to your account.
            </p>

          </div>


          <form
            className="user-auth-form"
            onSubmit={handleSubmit}
          >

            {/* =================================
                EMAIL
            ================================== */}

            <div className="user-auth-field">

              <label htmlFor="email">
                Email address
              </label>

              <div className="user-auth-input-wrapper">

                <span className="user-auth-input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  className="user-auth-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* =================================
                PASSWORD
            ================================== */}

            <div className="user-auth-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="user-auth-input-wrapper">

                <span className="user-auth-input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className="user-auth-input user-auth-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="user-auth-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* =================================
                ERROR
            ================================== */}

            {error && (
              <div className="user-auth-error">

                <span className="user-auth-error-icon">
                  !
                </span>

                <p>{error}</p>

              </div>
            )}


            {/* =================================
                LOGIN BUTTON
            ================================== */}

            <button
              type="submit"
              className="user-auth-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="user-auth-spinner" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}

            </button>

          </form>


          {/* =====================================
              SIGNUP
          ====================================== */}

          <div className="user-auth-switch">

            <span>
              Don't have an account?
            </span>

            <Link to="/signup">
              Create an account
            </Link>

          </div>


          {/* =====================================
              ADMIN
          ====================================== */}

          <div className="user-auth-admin-link">

            <Link to="/admin/login">
              Admin Login
            </Link>

          </div>


          {/* =====================================
              SECURITY
          ====================================== */}

          <div className="user-auth-security">

            <span>🔐</span>

            <p>
              Your account information is securely protected.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;

