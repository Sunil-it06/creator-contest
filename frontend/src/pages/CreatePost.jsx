import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../api/userApi";

const categories = [
  "Food",
  "Travel",
  "Dance",
  "Music",
  "Comedy",
  "Fitness",
  "Fashion",
  "Education",
  "Art",
  "Lifestyle",
];

const MAX_SIZE = 50 * 1024 * 1024;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
];

function CreatePost() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");

  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);

    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setError("");

    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      setFile(null);
      return setError(
        "Only JPG, PNG, WEBP, MP4 and WEBM files are allowed."
      );
    }

    if (selectedFile.size > MAX_SIZE) {
      setFile(null);
      return setError(
        "File size cannot exceed 50 MB."
      );
    }

    setFile(selectedFile);
  };

  const submitPost = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!file) {
      return setError("Please select an image or video.");
    }

    if (!caption.trim()) {
      return setError("Caption is required.");
    }

    if (!category) {
      return setError("Please select a category.");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("media", file);
      formData.append("caption", caption);
      formData.append("category", category);

      await userApi.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Post created successfully.");

      setFile(null);
      setCaption("");
      setCategory("");

      setTimeout(() => {
        navigate("/feed");
      }, 700);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create post."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="form-card">
        <h1>Create Post</h1>

        {error && <div className="error">{error}</div>}
        {success && (
          <div className="success">{success}</div>
        )}

        <form onSubmit={submitPost}>
          <label>Media</label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
            onChange={handleFileChange}
          />

          {preview && file?.type.startsWith("image/") && (
            <img
              src={preview}
              alt="Preview"
              className="preview-media"
            />
          )}

          {preview && file?.type.startsWith("video/") && (
            <video
              src={preview}
              controls
              className="preview-media"
            />
          )}

          <label>Category</label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="">
              Select category
            </option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label>Caption</label>

          <textarea
            value={caption}
            maxLength={1000}
            onChange={(e) =>
              setCaption(e.target.value)
            }
            placeholder="Write your caption..."
          />

          <div className="character-count">
            {caption.length}/1000
          </div>

          <button disabled={loading}>
            {loading
              ? "Publishing..."
              : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;