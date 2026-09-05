import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/feed">
        Creator Contest
      </Link>

      <div className="nav-links">
        <Link to="/feed">Feed</Link>

        <Link to="/create-post">
          Create Post
        </Link>

        <Link to="/profile">
          Profile
        </Link>

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;