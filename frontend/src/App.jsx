import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRankings from "./pages/AdminRankings";
import AdminWinners from "./pages/AdminWinners";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* USER */}

        <Route
          path="/feed"
          element={
            <ProtectedRoute type="user">
              <>
                <Navbar />
                <Feed />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute type="user">
              <>
                <Navbar />
                <Profile />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-post"
          element={
            <ProtectedRoute type="user">
              <>
                <Navbar />
                <CreatePost />
              </>
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute type="admin">
              <>
                <AdminNavbar />
                <AdminDashboard />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/rankings"
          element={
            <ProtectedRoute type="admin">
              <>
                <AdminNavbar />
                <AdminRankings />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/winners"
          element={
            <ProtectedRoute type="admin">
              <>
                <AdminNavbar />
                <AdminWinners />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;