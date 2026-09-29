import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../firebase";
import "./Signup.css";

function Signup({ onSignupSuccess, onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("owner");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // ---------------------------------
  // PASSWORD STRENGTH
  // ---------------------------------

  const getPasswordStrength = () => {
    if (password.length === 0) {
      return "";
    }

    if (password.length < 6) {
      return "Weak";
    }

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return "Strong";
    }

    return "Medium";
  };

  const passwordStrength = getPasswordStrength();


  // ---------------------------------
  // SIGNUP
  // ---------------------------------

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // Create Firebase account
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      // Save full name in Firebase
      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      // Send verification email
      await sendEmailVerification(
        userCredential.user
      );
      await setDoc(
  doc(db, "users", userCredential.user.uid),
  {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: role,
    createdAt: new Date(),
  }
);

      /*
        ROLE STORAGE

        Store the role separately for each email.
        This prevents one user's role from affecting
        another user's role.

        Example:
        shopManagerRole_user@gmail.com = owner
        shopManagerRole_staff@gmail.com = staff

        Note:
        This is frontend/local storage only.
        It is NOT secure server-side authorization.
      */

      const normalizedEmail =
        email.trim().toLowerCase();

      onSignupSuccess();

    } catch (error) {
      console.log(error);

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {
        setError(
          "This email is already registered."
        );

      } else if (
        error.code === "auth/invalid-email"
      ) {
        setError(
          "Please enter a valid email address."
        );

      } else if (
        error.code === "auth/weak-password"
      ) {
        setError(
          "Password is too weak."
        );

      } else {
        setError(
          "Unable to create account. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="signup-page">


      {/* =================================
          LEFT BRANDING
      ================================= */}

      <div className="signup-brand">

        <div className="signup-brand-content">

          <div className="signup-brand-logo">

            <div className="signup-logo-icon">
              S
            </div>

            <span>
              ShopManager
            </span>

          </div>


          <div className="signup-brand-badge">
            ✨ AI-Powered Shop Management
          </div>


          <h1>
            Manage your shop
            <br />
            <span>smarter.</span>
          </h1>


          <p className="signup-brand-description">
            Create your ShopManager account and
            manage inventory, billing, sales and
            reports in one place.
          </p>


          <div className="signup-features">

            <div className="signup-feature-item">

              <span className="signup-feature-check">
                ✓
              </span>

              Easy inventory management

            </div>


            <div className="signup-feature-item">

              <span className="signup-feature-check">
                ✓
              </span>

              Smart sales analytics

            </div>


            <div className="signup-feature-item">

              <span className="signup-feature-check">
                ✓
              </span>

              AI-powered assistance

            </div>

          </div>

        </div>

      </div>


      {/* =================================
          RIGHT SIGNUP SECTION
      ================================= */}

      <div className="signup-main">

        <div className="signup-card">


          {/* HEADER */}

          <div className="signup-header">

            <h2>
              Create Account
            </h2>

            <p>
              Create your account to get started
              with ShopManager
            </p>

          </div>


          <form onSubmit={handleSignup}>


            {/* FULL NAME */}

            <div className="signup-form-group">

              <label>
                Full Name
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
                  👤
                </span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="signup-form-group">

              <label>
                Email Address
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
                  ✉
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* ROLE */}

            <div className="signup-form-group">

              <label>
                Account Type
              </label>

              <div className="signup-role-buttons">

                <button
                  type="button"
                  className={
                    role === "owner"
                      ? "signup-role selected"
                      : "signup-role"
                  }
                  onClick={() =>
                    setRole("owner")
                  }
                >

                  <span className="signup-role-icon">
                    👑
                  </span>

                  <span>
                    <strong>
                      Shop Owner
                    </strong>

                    <small>
                      Full access
                    </small>
                  </span>

                </button>


                <button
                  type="button"
                  className={
                    role === "staff"
                      ? "signup-role selected"
                      : "signup-role"
                  }
                  onClick={() =>
                    setRole("staff")
                  }
                >

                  <span className="signup-role-icon">
                    👤
                  </span>

                  <span>
                    <strong>
                      Staff
                    </strong>

                    <small>
                      Limited access
                    </small>
                  </span>

                </button>

              </div>

            </div>


            {/* PASSWORD */}

            <div className="signup-form-group">

              <label>
                Password
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>


              {password && (

                <div
                  className={`password-strength ${passwordStrength.toLowerCase()}`}
                >
                  Password strength:{" "}

                  <strong>
                    {passwordStrength}
                  </strong>

                </div>

              )}

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="signup-form-group">

              <label>
                Confirm Password
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
                  🔐
                </span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            {/* ERROR */}

            {error && (

              <div className="signup-error">
                ⚠ {error}
              </div>

            )}


            {/* CREATE ACCOUNT */}

            <button
              type="submit"
              className="create-account-btn"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && (
                <span>
                  →
                </span>
              )}

            </button>

          </form>


          {/* SIGN IN */}

          <div className="signup-divider">

            <span>
              Already have an account?
            </span>

          </div>


          <button
            type="button"
            className="signup-signin-btn"
            onClick={onBackToLogin}
          >
            Sign In to ShopManager
          </button>


          {/* SECURITY */}

          <p className="signup-security-note">
            🔒 Your account information is securely
            protected by Firebase.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;