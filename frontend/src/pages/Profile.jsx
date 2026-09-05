import { useEffect, useState } from "react";
import userApi from "../api/userApi";

function Profile() {
  const [user, setUser] = useState(null);
  const [residency, setResidency] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await userApi.get("/users/me");

      setUser(response.data.user);
      setResidency(response.data.user.residency || "");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateResidency = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await userApi.put(
        "/users/profile",
        {
          residency,
        }
      );

      setUser(response.data.user);

      setMessage(
        response.data.isContestEligible
          ? "Residency updated. You are eligible for the contest."
          : "Residency updated. You are not eligible for the contest."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update residency"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page">Loading profile...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Profile</h1>
      </div>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      {user && (
        <div className="profile-card">
          <h2>{user.name}</h2>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <form onSubmit={updateResidency}>
            <label>Residency</label>

            <input
              value={residency}
              onChange={(e) =>
                setResidency(e.target.value)
              }
              placeholder="Enter your state"
            />

            <button disabled={saving}>
              {saving
                ? "Updating..."
                : "Update Residency"}
            </button>
          </form>

          <div className="eligibility">
            <strong>Contest Eligibility</strong>

            <span
              className={
                user.residency?.toLowerCase() ===
                "chhattisgarh"
                  ? "eligible"
                  : "not-eligible"
              }
            >
              {user.residency?.toLowerCase() ===
              "chhattisgarh"
                ? "Eligible"
                : "Not Eligible"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;