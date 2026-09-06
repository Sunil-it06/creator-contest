
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

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await userApi.post("/auth/signup", form);

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-auth-page">

      <div className="user-auth-card">

        {/* Brand */}
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
                <span>Create and share your content</span>
              </div>

              <div className="user-auth-feature">
                <span className="user-auth-feature-icon">
                  ✓
                </span>
                <span>Compete across multiple categories</span>
              </div>

              <div className="user-auth-feature">
                <span className="user-auth-feature-icon">
                  ✓
                </span>
                <span>Climb the creator rankings</span>
              </div>

              <div className="user-auth-feature">
                <span className="user-auth-feature-icon">
                  ✓
                </span>
                <span>Get a chance to win prizes</span>
              </div>

            </div>

          </div>

        </div>


        {/* Form */}
        <div className="user-auth-form-area">

          <div className="user-auth-header">

            <h2>Create your account</h2>

            <p>
              Enter your details to get started.
            </p>

          </div>


          <form
            className="user-auth-form"
            onSubmit={handleSubmit}
          >

            {/* Name */}
            <div className="user-auth-field">

              <label htmlFor="name">
                Full name
              </label>

              <div className="user-auth-input-wrapper">

                <span className="user-auth-input-icon">
                  👤
                </span>

                <input
                  id="name"
                  name="name"
                  type="text"
                  className="user-auth-input"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />

              </div>

            </div>


            {/* Email */}
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
                  name="email"
                  type="email"
                  className="user-auth-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* Password */}
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
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className="user-auth-input user-auth-password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
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

              <span className="user-auth-hint">
                Minimum 6 characters
              </span>

            </div>


            {/* Error */}
            {error && (
              <div className="user-auth-error">

                <span className="user-auth-error-icon">
                  !
                </span>

                <p>{error}</p>

              </div>
            )}


            {/* Submit */}
            <button
              type="submit"
              className="user-auth-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="user-auth-spinner" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}

            </button>

          </form>


          {/* Login */}
          <div className="user-auth-switch">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>


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

export default Signup;

