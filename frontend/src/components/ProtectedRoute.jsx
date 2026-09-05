import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  type = "user",
}) {
  const token =
    type === "admin"
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("userToken");

  if (!token) {
    return (
      <Navigate
        to={
          type === "admin"
            ? "/admin/login"
            : "/login"
        }
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;