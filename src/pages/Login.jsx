import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../firebase";
import "../Login.css";

function Login({ onSignup }) {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("owner");
  const [language, setLanguage] = useState("English");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loading, setLoading] = useState(false);

  const isHinglish = language === "Hinglish";

  // -----------------------------
  // LOGIN
  // -----------------------------
  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!email || !password) {
      setMessage(
        isHinglish
          ? "Please email aur password enter karo."
          : "Please enter your email and password."
      );
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
  auth,
  email,
  password
);

const user = userCredential.user;

if (!user.emailVerified) {
  await auth.signOut();

  setMessage(
    isHinglish
      ? "📧 Pehle apna email verify karo. Verification link Gmail par bheja gaya hai."
      : "📧 Please verify your email before logging in. Check your Gmail."
  );

  setMessageType("error");
  return;
}


      // Firebase authentication is successful.
      // App.jsx will automatically detect the logged-in user.
    } catch (error) {
      console.log(error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setMessage(
          isHinglish
            ? "❌ Email ya password galat hai."
            : "❌ Incorrect email or password."
        );
      } else if (error.code === "auth/invalid-email") {
        setMessage(
          isHinglish
            ? "❌ Valid email enter karo."
            : "❌ Please enter a valid email address."
        );
      } else if (error.code === "auth/too-many-requests") {
        setMessage(
          isHinglish
            ? "⚠️ Bahut saare failed attempts. Thodi der baad try karo."
            : "⚠️ Too many failed attempts. Please try again later."
        );
      } else {
        setMessage(
          isHinglish
            ? "❌ Login nahi ho saka. Please try again."
            : "❌ Unable to login. Please try again."
        );
      }

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // FORGOT PASSWORD
  // -----------------------------
  const handleForgotPassword = async () => {
    setMessage("");
    setMessageType("");

    if (!email) {
      setMessage(
        isHinglish
          ? "Pehle apna email enter karo."
          : "Please enter your email first."
      );
      setMessageType("error");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);

      setMessage(
        isHinglish
          ? "📧 Password reset link email par bhej diya gaya hai."
          : "📧 Password reset link has been sent to your email."
      );

      setMessageType("success");
    } catch (error) {
      console.log(error);

      if (error.code === "auth/user-not-found") {
        setMessage(
          isHinglish
            ? "❌ Is email se koi account nahi mila."
            : "❌ No account found with this email."
        );
      } else if (error.code === "auth/invalid-email") {
        setMessage(
          isHinglish
            ? "❌ Valid email enter karo."
            : "❌ Please enter a valid email address."
        );
      } else {
        setMessage(
          isHinglish
            ? "❌ Password reset nahi ho saka."
            : "❌ Unable to send password reset email."
        );
      }

      setMessageType("error");
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-showcase">

        <div className="brand">
          <div className="brand-icon">🏪</div>

          <div>
            <h1>ShopManager</h1>
            <p>AI Inventory Management</p>
          </div>
        </div>

        <div className="showcase-content">

          <span className="ai-badge">
            ✨ AI POWERED
          </span>

          <h2>
            Your shop.
            <br />
            <span>Smarter.</span>
          </h2>

          <p>
            Manage inventory, billing, sales and suppliers
            from one intelligent system.
          </p>

          <div className="feature-list">
            <div>📦 Smart Inventory</div>
            <div>📊 Sales Analytics</div>
            <div>🤖 AI Assistant</div>
            <div>⚠️ Stock Alerts</div>
          </div>

        </div>

        <div className="floating-card stock-card">
          <span>📦</span>

          <div>
            <small>Total Products</small>
            <strong>842</strong>
          </div>
        </div>

        <div className="floating-card sales-card">
          <span>📈</span>

          <div>
            <small>Today's Sales</small>
            <strong>₹8,450</strong>
          </div>
        </div>

        <div className="ai-message">
          🤖 <span>AI says: 14 items need restocking</span>
        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="login-section">

        <div className="login-card">

          {/* LANGUAGE */}
          <div className="language-switch">

            <button
              type="button"
              className={language === "English" ? "active" : ""}
              onClick={() => setLanguage("English")}
            >
              🇬🇧 English
            </button>

            <button
              type="button"
              className={language === "Hinglish" ? "active" : ""}
              onClick={() => setLanguage("Hinglish")}
            >
              🇮🇳 Hinglish
            </button>

          </div>


          <div className="mobile-logo">
            🏪
          </div>


          <h2>
            Welcome back! 👋
          </h2>

          <p className="login-subtitle">
            {isHinglish
              ? "Apne shop dashboard mein login karo."
              : "Login to your shop dashboard."}
          </p>


          {/* ROLE */}
          <div className="role-section">

            <p>Login as</p>

            <div className="role-buttons">

              <button
                type="button"
                className={role === "owner" ? "selected" : ""}
                onClick={() => setRole("owner")}
              >
                👑

                <span>
                  <strong>Shop Owner</strong>
                  <small>Full access</small>
                </span>

              </button>


              <button
                type="button"
                className={role === "staff" ? "selected" : ""}
                onClick={() => setRole("staff")}
              >
                👤

                <span>
                  <strong>Staff</strong>
                  <small>Limited access</small>
                </span>

              </button>

            </div>

          </div>


          {/* LOGIN FORM */}
          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <label>Email</label>

            <div className="input-wrapper">

              <span>✉️</span>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage("");
                }}
                required
              />

            </div>


            {/* PASSWORD */}
            <label>Password</label>

            <div className="input-wrapper">

              <span>🔒</span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMessage("");
                }}
                required
              />

              <button
                type="button"
                className="show-button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>


            {/* PASSWORD STRENGTH */}
            {password && (
              <div className="password-strength">

                <div className="strength-bar">

                  <div
                    className={
                      password.length >= 6
                        ? "strength-fill strong"
                        : "strength-fill weak"
                    }
                  ></div>

                </div>

                <small>
                  {password.length >= 6
                    ? "Strong password"
                    : "Weak password"}
                </small>

              </div>
            )}


            {/* LOGIN OPTIONS */}
            <div className="login-options">

              <label className="remember">

                <input type="checkbox" />

                Remember me

              </label>


              <button
                type="button"
                className="forgot"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>

            </div>


            {/* LOGIN BUTTON */}
            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >

              <span>🚀</span>

              {loading
                ? "Logging in..."
                : isHinglish
                ? "Login Karo"
                : "Login"}

              <span>→</span>

            </button>

          </form>


          {/* MESSAGE */}
          {message && (
            <div
              className={`login-message ${
                messageType === "success"
                  ? "success-message"
                  : ""
              }`}
            >
              {message}
            </div>
          )}


          {/* SIGN UP */}
          <div className="signup-section">
            <p>
              {isHinglish
              ? "Account nahi hai?"
              : "Don't have an account?"}
              </p>
              <button
              type="button"
              className="signup-button"
              onClick={onSignup}
              >
                <span>
                  {isHinglish ? "Sign Up Karo" : "Create Account"}
                </span>
                <span className="signup-arrow">→</span>
              </button>
           </div>

        </div>

      </div>

    </div>
  );
}

export default Login;