import { useState } from "react";
import userApi from "../api/userApi";

const USER_SERVICE_URL =
  import.meta.env.VITE_USER_API?.replace("/api", "") ||
  "http://localhost:5000";

function PostCard({ post }) {
  const [likes, setLikes] = useState(
    post.likesCount || 0
  );

  const [comments, setComments] = useState(
    post.commentsCount || 0
  );

  const [views, setViews] = useState(
    post.viewsCount || 0
  );

  const [commentText, setCommentText] =
    useState("");

  const [error, setError] = useState("");
  const [commentLoading, setCommentLoading] =
    useState(false);

  const mediaUrl =
    USER_SERVICE_URL + post.media.path;

  const likePost = async () => {
    try {
      setError("");

      await userApi.post(
        `/posts/${post._id}/like`
      );

      setLikes((value) => value + 1);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to like post"
      );
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) {
      return;
    }

    try {
      setCommentLoading(true);
      setError("");

      await userApi.post(
        `/posts/${post._id}/comment`,
        {
          text: commentText.trim(),
        }
      );

      setComments((value) => value + 1);
      setCommentText("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to add comment"
      );
    } finally {
      setCommentLoading(false);
    }
  };

  const countView = async () => {
    try {
      setError("");

      await userApi.post(
        `/posts/${post._id}/view`
      );

      setViews((value) => value + 1);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to count view"
      );
    }
  };

  return (
    <article className="post-card">
      <div className="post-header">
        <div>
          <h3>
            {post.creatorId?.name ||
              "Unknown Creator"}
          </h3>

          <small>
            {post.creatorId?.email || ""}
          </small>
        </div>

        <span className="category">
          {post.category}
        </span>
      </div>

      <p className="caption">
        {post.caption}
      </p>

      {post.media?.type === "image" ? (
        <img
          src={mediaUrl}
          alt={post.caption}
          className="post-media"
        />
      ) : (
        <video
          src={mediaUrl}
          controls
          className="post-media"
          onPlay={countView}
        />
      )}

      <div className="stats">
        <span>❤️ {likes}</span>
        <span>💬 {comments}</span>
        <span>👁️ {views}</span>
      </div>

      <div className="actions">
        <button onClick={likePost}>
          ❤️ Like
        </button>

        <button onClick={countView}>
          👁️ Count View
        </button>
      </div>

      <div className="comment-box">
        <input
          value={commentText}
          onChange={(e) =>
            setCommentText(e.target.value)
          }
          placeholder="Write a comment..."
          maxLength={500}
        />

        <button
          onClick={addComment}
          disabled={commentLoading}
        >
          {commentLoading
            ? "Adding..."
            : "Comment"}
        </button>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </article>
  );
}

export default PostCard;