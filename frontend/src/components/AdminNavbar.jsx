import { Link, useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <nav className="navbar admin-navbar">
      <Link to="/admin/dashboard">
        Admin Dashboard
      </Link>

      <div className="nav-links">
        <Link to="/admin/rankings">
          Rankings
        </Link>

        <Link to="/admin/winners">
          Winners
        </Link>

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;