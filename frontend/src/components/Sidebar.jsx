import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUploadCloud,
  FiClock,
  FiFileText,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";

import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          D
        </div>

        <div className="sidebar-brand-info">
          <div className="sidebar-brand-name">
            DocuVerify
          </div>

          <div className="sidebar-brand-subtitle">
            AI DOCUMENT VALIDATION
          </div>
        </div>
      </div>


      {/* Navigation */}
      <div className="sidebar-content">

        <nav>

          {/* Workspace */}
          <div className="sidebar-group">

            <div className="sidebar-group-title">
              WORKSPACE
            </div>

            <SidebarItem
              to="/dashboard"
              icon={<FiHome />}
              label="Dashboard"
            />

            <SidebarItem
              to="/upload"
              icon={<FiUploadCloud />}
              label="New Validation"
            />

          </div>


          {/* Activity */}
          <div className="sidebar-group">

            <div className="sidebar-group-title">
              ACTIVITY
            </div>

            <SidebarItem
              to="/history"
              icon={<FiClock />}
              label="History"
            />

            <SidebarItem
              to="/reports"
              icon={<FiFileText />}
              label="Reports"
            />

          </div>


          {/* Insights */}
          <div className="sidebar-group">

            <div className="sidebar-group-title">
              INSIGHTS
            </div>

            <SidebarItem
              to="/analytics"
              icon={<FiBarChart2 />}
              label="Analytics"
            />

          </div>

        </nav>

      </div>


      {/* Bottom */}
      <div className="sidebar-bottom">

        <SidebarItem
          to="/settings"
          icon={<FiSettings />}
          label="Settings"
        />

        <div className="sidebar-footer">
          <span>DocuVerify</span>
          <span>v1.0</span>
        </div>

      </div>

    </aside>
  );
}


function SidebarItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? "sidebar-item-active" : ""}`
      }
    >

      <span className="sidebar-item-icon">
        {icon}
      </span>

      <span className="sidebar-item-label">
        {label}
      </span>

    </NavLink>
  );
}


export default Sidebar;