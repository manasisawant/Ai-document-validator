import { Link } from "react-router-dom";
import {
  FiFileText,
  FiCheckCircle,
  FiAlertTriangle,
  FiArrowUpRight,
  FiPlus,
} from "react-icons/fi";

import "./DashboardPage.css";

function DashboardPage() {
  return (
    <div className="dashboard-page">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <div className="dashboard-eyebrow">
            OVERVIEW
          </div>

          <h1>Dashboard</h1>

          <p>
            Monitor your document validation activity from one place.
          </p>
        </div>

        <Link
          to="/upload"
          className="dashboard-primary-button"
        >
          <FiPlus />
          New Validation
        </Link>
      </div>


      {/* Statistics */}
      <section className="dashboard-stats">

        <div className="dashboard-stat-card">
          <div className="stat-card-header">
            <span>Total Documents</span>

            <div className="stat-icon stat-blue">
              <FiFileText />
            </div>
          </div>

          <strong>0</strong>

          <small>
            Documents processed
          </small>
        </div>


        <div className="dashboard-stat-card">
          <div className="stat-card-header">
            <span>Validated</span>

            <div className="stat-icon stat-green">
              <FiCheckCircle />
            </div>
          </div>

          <strong>0</strong>

          <small>
            Successfully validated
          </small>
        </div>


        <div className="dashboard-stat-card">
          <div className="stat-card-header">
            <span>Mismatches</span>

            <div className="stat-icon stat-orange">
              <FiAlertTriangle />
            </div>
          </div>

          <strong>0</strong>

          <small>
            Require review
          </small>
        </div>

      </section>


      {/* Recent activity */}
      <section className="dashboard-activity">

        <div className="activity-header">

          <div>
            <div className="dashboard-eyebrow">
              ACTIVITY
            </div>

            <h2>
              Recent validations
            </h2>
          </div>

          <Link
            to="/history"
            className="activity-link"
          >
            View history
            <FiArrowUpRight />
          </Link>

        </div>


        <div className="dashboard-empty">

          <div className="empty-document-icon">
            <FiFileText />
          </div>

          <h3>
            No validation activity yet
          </h3>

          <p>
            Start by uploading a document and its reference
            Excel file.
          </p>

          <Link
            to="/upload"
            className="empty-button"
          >
            <FiPlus />
            Start validation
          </Link>

        </div>

      </section>

    </div>
  );
}

export default DashboardPage;