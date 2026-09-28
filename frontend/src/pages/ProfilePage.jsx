import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiFileText,
  FiCheckCircle,
  FiLogOut,
  FiShield,
} from "react-icons/fi";

import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [userResponse, historyResponse] =
          await Promise.all([
            fetch("http://127.0.0.1:8000/user/me", {
              method: "GET",
              headers,
            }),

            fetch("http://127.0.0.1:8000/history/", {
              method: "GET",
              headers,
            }),
          ]);

        if (
          userResponse.status === 401 ||
          historyResponse.status === 401
        ) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_type");
          navigate("/login");
          return;
        }

        if (!userResponse.ok) {
          throw new Error("Unable to load profile.");
        }

        const userData = await userResponse.json();
        const historyData = await historyResponse.json();

        setUser(userData);
        setHistory(
          Array.isArray(historyData)
            ? historyData
            : []
        );
      } catch (err) {
        console.error("Profile Error:", err);
        setError("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");

    sessionStorage.removeItem("validationResult");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile-state">
        <div className="profile-spinner" />
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-state">
        <div className="profile-error-icon">
          <FiUser />
        </div>

        <h2>{error}</h2>

        <button
          className="profile-primary-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  const totalValidations = history.length;

  const totalMatched = history.reduce(
    (sum, item) =>
      sum + Number(item.matched_count || 0),
    0
  );

  const totalMismatches = history.reduce(
    (sum, item) =>
      sum + Number(item.mismatches_count || 0),
    0
  );

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div>
          <div className="profile-eyebrow">
            <FiUser />
            ACCOUNT
          </div>

          <h1>Profile</h1>

          <p>
            Manage your DocuVerify account information.
          </p>
        </div>
      </div>

      {/* Main Profile Layout */}
      <div className="profile-grid">
        {/* User Card */}
        <section className="profile-card profile-user-card">
          <div className="profile-avatar">
            {initials}
          </div>

          <h2>{user?.name || "User"}</h2>

          <p className="profile-user-email">
            {user?.email || "No email available"}
          </p>

          <div className="profile-status">
            <span className="status-dot" />
            Account active
          </div>

          <div className="profile-divider" />

          <button
            className="profile-logout-button"
            onClick={handleLogout}
          >
            <FiLogOut />
            Sign out
          </button>
        </section>

        {/* Account Details */}
        <section className="profile-card">
          <div className="profile-card-header">
            <div>
              <h2>Account Information</h2>
              <p>
                Your registered DocuVerify account details.
              </p>
            </div>

            <div className="profile-header-icon">
              <FiShield />
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-detail-row">
              <div className="profile-detail-icon">
                <FiUser />
              </div>

              <div>
                <span>Name</span>
                <strong>
                  {user?.name || "-"}
                </strong>
              </div>
            </div>

            <div className="profile-detail-row">
              <div className="profile-detail-icon">
                <FiMail />
              </div>

              <div>
                <span>Email address</span>
                <strong>
                  {user?.email || "-"}
                </strong>
              </div>
            </div>

            <div className="profile-detail-row">
              <div className="profile-detail-icon">
                <FiShield />
              </div>

              <div>
                <span>Authentication</span>
                <strong>JWT session</strong>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Activity Summary */}
      <section className="profile-card profile-activity-card">
        <div className="profile-card-header">
          <div>
            <h2>Validation Activity</h2>
            <p>
              Summary of your document validation activity.
            </p>
          </div>

          <button
            className="profile-history-button"
            onClick={() => navigate("/history")}
          >
            View History →
          </button>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-icon blue">
              <FiFileText />
            </div>

            <div>
              <span>Total Validations</span>
              <strong>{totalValidations}</strong>
            </div>
          </div>

          <div className="profile-stat">
            <div className="profile-stat-icon green">
              <FiCheckCircle />
            </div>

            <div>
              <span>Matched Fields</span>
              <strong>{totalMatched}</strong>
            </div>
          </div>

          <div className="profile-stat">
            <div className="profile-stat-icon red">
              <FiFileText />
            </div>

            <div>
              <span>Mismatched Fields</span>
              <strong>{totalMismatches}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="profile-card security-card">
        <div className="security-icon">
          <FiShield />
        </div>

        <div className="security-content">
          <h2>Account Security</h2>

          <p>
            Your session is authenticated using a secure
            JWT access token. Password management is handled
            through the authentication system.
          </p>
        </div>

        <div className="security-badge">
          <span />
          Secure session
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;