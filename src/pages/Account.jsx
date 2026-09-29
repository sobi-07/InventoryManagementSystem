import { useState } from "react";
import {
  updatePassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";
import "../Account.css";

function Account({ user, userRole, onBack, onLogout }) {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const userName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  const userEmail =
    user?.email?.trim().toLowerCase() || "";

  const initials = userName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isOwner = userRole === "owner";

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (newPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await updatePassword(auth.currentUser, newPassword);

      setMessage("Password changed successfully.");
      setNewPassword("");
      setShowPassword(false);
    } catch (error) {
      console.error(error);

      if (error.code === "auth/requires-recent-login") {
        setError(
          "For security, please logout and login again before changing your password."
        );
      } else {
        setError("Unable to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    setMessage("");
    setError("");

    try {
      await sendEmailVerification(auth.currentUser);
      setMessage("Verification email sent. Please check your inbox.");
    } catch (error) {
      console.error(error);
      setError("Unable to send verification email.");
    }
  };

  return (
    <div className="account-page">

      <div className="account-header">
        <button
          className="account-back-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>

        <div>
          <p className="account-label">ACCOUNT</p>
          <h1>My Account</h1>
          <p>Manage your profile and security settings.</p>
        </div>
      </div>

      <div className="account-container">

        {/* PROFILE CARD */}

        <div className="account-card profile-card">

          <div className="account-avatar">
            {initials}
          </div>

          <div className="account-profile-info">
            <h2>{userName}</h2>

            <p>{userEmail}</p>

            <span className="account-role">
              {isOwner ? "👑 Shop Owner" : "👤 Staff"}
            </span>
          </div>

        </div>


        {/* ACCOUNT INFORMATION */}

        <div className="account-card">

          <div className="account-card-header">
            <div>
              <h2>Account Information</h2>
              <p>Your registered account details.</p>
            </div>
          </div>

          <div className="account-info-grid">

            <div className="account-info-item">
              <span>Name</span>
              <strong>{userName}</strong>
            </div>

            <div className="account-info-item">
              <span>Email</span>
              <strong>{userEmail}</strong>
            </div>

            <div className="account-info-item">
              <span>Account Type</span>
              <strong>
                {isOwner ? "Shop Owner" : "Staff"}
              </strong>
            </div>

            <div className="account-info-item">
              <span>Account Status</span>

              {user?.emailVerified ? (
                <strong className="verified">
                  ✓ Email Verified
                </strong>
              ) : (
                <div>
                  <strong className="not-verified">
                    ⚠ Not Verified
                  </strong>

                  <button
                    className="verify-button"
                    onClick={handleSendVerification}
                  >
                    Send Verification Email
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>


        {/* SECURITY */}

        <div className="account-card">

          <div className="account-card-header">
            <div>
              <h2>Security</h2>
              <p>Update your account password.</p>
            </div>
          </div>

          <form
            className="password-form"
            onSubmit={handleChangePassword}
          >

            <label>New Password</label>

            <div className="password-input-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Enter new password"
                minLength="6"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

            <button
              type="submit"
              className="change-password-button"
              disabled={loading}
            >
              {loading
                ? "Changing..."
                : "Change Password"}
            </button>

          </form>

          {message && (
            <div className="account-success">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="account-error">
              ⚠ {error}
            </div>
          )}

        </div>


        {/* LOGOUT */}

        <div className="account-card account-danger">

          <div>
            <h2>Sign Out</h2>
            <p>
              Sign out of your ShopManager account on this device.
            </p>
          </div>

          <button
            className="account-logout-button"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Account;