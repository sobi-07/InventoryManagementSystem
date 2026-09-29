import { useState } from "react";
import "../Settings.css";

function Settings({ user, userRole, onBack }) {
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState(true);

  const userName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  const userEmail =
    user?.email?.trim().toLowerCase() || "";

  const isOwner = userRole === "owner";

  return (
    <div className="settings-page">

      <div className="settings-header">

        <button
          className="settings-back-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>

        <p className="settings-label">SETTINGS</p>

        <h1>Settings ⚙️</h1>

        <p>
          Manage your ShopManager preferences.
        </p>

      </div>


      <div className="settings-container">

        {/* ACCOUNT */}

        <div className="settings-card">

          <div className="settings-card-header">
            <div>
              <h2>👤 Account</h2>
              <p>Your current account information.</p>
            </div>
          </div>

          <div className="settings-info">

            <div>
              <span>Name</span>
              <strong>{userName}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{userEmail}</strong>
            </div>

            <div>
              <span>Account Type</span>
              <strong>
                {isOwner ? "👑 Shop Owner" : "👤 Staff"}
              </strong>
            </div>

          </div>

        </div>


        {/* PREFERENCES */}

        <div className="settings-card">

          <div className="settings-card-header">
            <div>
              <h2>🌐 Preferences</h2>
              <p>Choose how ShopManager should work for you.</p>
            </div>
          </div>

          <div className="settings-option">

            <div>
              <strong>Language</strong>
              <small>
                Choose the language used in the application.
              </small>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Hinglish</option>
            </select>

          </div>


          <div className="settings-option">

            <div>
              <strong>Notifications</strong>
              <small>
                Receive important shop alerts and updates.
              </small>
            </div>

            <button
              className={
                notifications
                  ? "settings-toggle active"
                  : "settings-toggle"
              }
              onClick={() =>
                setNotifications(!notifications)
              }
            >
              <span></span>
            </button>

          </div>

        </div>


        {/* SECURITY */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div>
              <h2>🔐 Security</h2>
              <p>Security-related account information.</p>
            </div>

          </div>

          <div className="security-status">

            <div className="security-icon">
              ✓
            </div>

            <div>
              <strong>Email verification</strong>

              <small>
                {user?.emailVerified
                  ? "Your email address is verified."
                  : "Your email address is not verified."}
              </small>
            </div>

            <span
              className={
                user?.emailVerified
                  ? "security-badge verified"
                  : "security-badge pending"
              }
            >
              {user?.emailVerified
                ? "Verified"
                : "Pending"}
            </span>

          </div>

        </div>


        {/* ACCESS */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div>
              <h2>🛡️ Access</h2>
              <p>Your access level in ShopManager.</p>
            </div>

          </div>

          <div className="access-box">

            <div className="access-icon">
              {isOwner ? "👑" : "👤"}
            </div>

            <div>
              <strong>
                {isOwner ? "Shop Owner" : "Staff Member"}
              </strong>

              <small>
                {isOwner
                  ? "You have access to owner-level features such as Analytics and Reports."
                  : "You have access to staff-level features. Owner-only features are restricted."}
              </small>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Settings;