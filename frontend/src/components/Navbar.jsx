import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiChevronDown,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/upload": "New Validation",
    "/history": "Validation History",
    "/analytics": "Analytics",
    "/reports": "Reports",
    "/profile": "Profile",
    "/settings": "Settings",
  };

  const pageTitle =
    pageTitles[location.pathname] || "Dashboard";

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/user/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_type");
          setUser(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load user.");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Navbar User Error:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, [location.pathname]);

  const handleProfileClick = () => {
    setProfileOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    sessionStorage.removeItem("validationResult");

    setUser(null);
    setProfileOpen(false);

    navigate("/login");
  };

  const getInitials = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name
      .split(" ")
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="app-navbar">
      <div className="navbar-page-title">
        {pageTitle}
      </div>

      <div className="navbar-actions">
        {/* Search */}
        <button
          className="navbar-icon-button"
          type="button"
          aria-label="Search"
        >
          <FiSearch />
        </button>

        {/* Notifications */}
        <button
          className="navbar-icon-button"
          type="button"
          aria-label="Notifications"
        >
          <FiBell />
        </button>

        <div className="navbar-divider" />

        {user ? (
          <div className="navbar-profile-wrapper">
            <button
              type="button"
              className={`navbar-profile-button ${
                profileOpen
                  ? "navbar-profile-button-active"
                  : ""
              }`}
              onClick={() =>
                setProfileOpen((current) => !current)
              }
            >
              <div className="navbar-avatar">
                {getInitials()}
              </div>

              <div className="navbar-user-info">
                <span className="navbar-user-name">
                  {user.name}
                </span>

                <span className="navbar-user-role">
                  Account
                </span>
              </div>

              <FiChevronDown
                className={`navbar-chevron ${
                  profileOpen
                    ? "navbar-chevron-open"
                    : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="navbar-profile-menu">
                <div className="navbar-menu-user">
                  <div className="navbar-menu-avatar">
                    {getInitials()}
                  </div>

                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className="navbar-menu-divider" />

                <button
                  type="button"
                  className="navbar-menu-item"
                  onClick={handleProfileClick}
                >
                  <FiUser />
                  <span>View Profile</span>
                </button>

                <button
                  type="button"
                  className="navbar-menu-item navbar-menu-logout"
                  onClick={handleLogout}
                >
                  <FiLogOut />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="navbar-signin"
            type="button"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;