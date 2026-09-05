import { useState } from "react";
import adminApi from "../api/adminApi";

function AdminRankings() {
  const [type, setType] = useState("global");
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


const loadRanking = async (selectedType) => {
  try {
    setLoading(true);
    setError("");

    const response = await adminApi.get(
      `/admin/rankings/${selectedType}`
    );

    console.log(
      `${selectedType} ranking response:`,
      response.data
    );

    setRanking(response.data.ranking || []);
  } catch (error) {
    console.error(
      `Failed to load ${selectedType} ranking:`,
      error
    );

    setRanking([]);

    setError(
      error.response?.data?.message ||
        "Unable to load ranking"
    );
  } finally {
    setLoading(false);
  }
};


  const changeType = (value) => {
    setType(value);
    setRanking([]);
    loadRanking(value);
  };

  return (
    <div className="page">
      <h1>Rankings</h1>

      <div className="tabs">
        <button
          className={
            type === "global" ? "active" : ""
          }
          onClick={() => changeType("global")}
        >
          Global
        </button>

        <button
          className={
            type === "category" ? "active" : ""
          }
          onClick={() => changeType("category")}
        >
          Category
        </button>

        <button
          className={
            type === "consistency" ? "active" : ""
          }
          onClick={() =>
            changeType("consistency")
          }
        >
          Consistency
        </button>
      </div>

      {error && (
        <div className="error">{error}</div>
      )}

      {loading && <p>Loading ranking...</p>}

      {!loading && ranking.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Creator</th>
                <th>Category</th>
                <th>Score</th>
                <th>Likes</th>
                <th>Comments</th>
                <th>Views</th>
              </tr>
            </thead>

            <tbody>
              {ranking.map((item, index) => (
                <tr
                  key={`${item.postId || item.creatorId}-${index}`}
                >
                  <td>{item.rank}</td>

                  <td>
                    {item.creatorId}
                  </td>

                  <td>
                    {item.category || "-"}
                  </td>

                  <td>
                    {item.score}
                  </td>

                  <td>
                    {item.likesCount ?? "-"}
                  </td>

                  <td>
                    {item.commentsCount ?? "-"}
                  </td>

                  <td>
                    {item.viewsCount ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminRankings;