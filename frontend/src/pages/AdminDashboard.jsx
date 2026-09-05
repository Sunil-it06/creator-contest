import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";

function AdminDashboard() {
  const [data, setData] = useState({
    users: 0,
    posts: 0,
    winners: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          usersResponse,
          postsResponse,
          winnersResponse,
        ] = await Promise.all([
          adminApi.get("/admin/data/users"),
          adminApi.get("/admin/data/posts"),
          adminApi.get("/admin/winners"),
        ]);

        setData({
          users:
            usersResponse.data.users?.length || 0,

          posts:
            postsResponse.data.posts?.length || 0,

          winners:
            winnersResponse.data.winners?.length || 0,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Users</h3>
          <strong>{data.users}</strong>
        </div>

        <div className="stat-card">
          <h3>Posts</h3>
          <strong>{data.posts}</strong>
        </div>

        <div className="stat-card">
          <h3>Winners</h3>
          <strong>{data.winners}</strong>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;