import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";

function AdminWinners() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadWinners = async () => {
    try {
      const response =
        await adminApi.get("/admin/winners");

      setWinners(
        response.data.winners || []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load winners"
      );
    }
  };

  useEffect(() => {
    loadWinners();
  }, []);

  const generateWinners = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response =
        await adminApi.get(
          "/admin/winners/generate"
        );

      setWinners(
        response.data.winners || []
      );

      setMessage(
        "Winners generated successfully."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to generate winners"
      );
    } finally {
      setLoading(false);
    }
  };

  const requestKyc = async (winnerId) => {
    try {
      await adminApi.post(
        `/admin/winners/${winnerId}/kyc`
      );

      setMessage(
        "KYC request sent successfully."
      );

      loadWinners();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to request KYC"
      );
    }
  };

  const passKyc = async (winnerId) => {
    try {
      await adminApi.post(
        `/admin/winners/${winnerId}/kyc/pass`
      );

      setMessage(
        "KYC marked as passed."
      );

      loadWinners();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to pass KYC"
      );
    }
  };

  const failKyc = async (winnerId) => {
    const remarks = prompt(
      "Enter reason for KYC failure:"
    );

    try {
      await adminApi.post(
        `/admin/winners/${winnerId}/kyc/fail`,
        {
          remarks: remarks || "KYC failed",
        }
      );

      setMessage(
        "KYC failed. Winner cascade processed."
      );

      loadWinners();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to fail KYC"
      );
    }
  };

  return (
    <div className="container">
      <h2>Winner Management</h2>

      <button
        onClick={generateWinners}
        disabled={loading}
      >
        {loading
          ? "Generating..."
          : "Generate Winners"}
      </button>

      {message && (
        <p className="success">
          {message}
        </p>
      )}

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Prize Tier</th>
            <th>Prize</th>
            <th>Status</th>
            <th>KYC</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {winners.map((winner) => (
            <tr key={winner.id}>
              <td>{winner.userId}</td>

              <td>
                {winner.prizeTier}
              </td>

              <td>
                {winner.prizeName}
              </td>

              <td>
                {winner.status}
              </td>

              <td>
                {winner.kycStatus}
              </td>

              <td>
                {winner.status === "ACTIVE" &&
                  winner.kycStatus ===
                    "NOT_REQUESTED" && (
                    <button
                      onClick={() =>
                        requestKyc(winner.id)
                      }
                    >
                      Request KYC
                    </button>
                  )}

                {winner.status === "ACTIVE" &&
                  winner.kycStatus ===
                    "PENDING" && (
                    <>
                      <button
                        onClick={() =>
                          passKyc(winner.id)
                        }
                      >
                        Pass
                      </button>

                      <button
                        onClick={() =>
                          failKyc(winner.id)
                        }
                      >
                        Fail
                      </button>
                    </>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminWinners;