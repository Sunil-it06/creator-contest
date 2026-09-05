import { useEffect, useState } from "react";
import userApi from "../api/userApi";
import PostCard from "../components/PostCard";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);

      const response =
        await userApi.get("/posts");

      setPosts(response.data.posts || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load feed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="page">
        Loading feed...
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Creator Feed</h1>

        <button onClick={loadPosts}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="error">{error}</div>
      )}

      {posts.length === 0 ? (
        <div className="empty">
          No posts available.
        </div>
      ) : (
        <div className="feed">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;