import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ onLogout, isAuthenticated }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate(isAuthenticated ? "/chat" : "/login")}>
        Clouber
      </div>

      <div className="nav-links">
        {!isAuthenticated && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Register
            </NavLink>
          </>
        )}

        {isAuthenticated && (
          <>
            <NavLink
              to="/chat"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Chat
            </NavLink>
            <button className="primary" onClick={handleLogoutClick}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
