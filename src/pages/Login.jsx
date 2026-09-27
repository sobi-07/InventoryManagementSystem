import { useState } from "react";
import "../Login.css";

function Login({onLogin}) {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("owner");
  const [language, setLanguage] = useState("English");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const isHinglish = language === "Hinglish";

  const fillDemo = () => {
    setEmail("admin@shop.com");
    setPassword("123456");
    setMessage("");
  };

  const handleLogin = (e) => {
  e.preventDefault();

  if (!email || !password) {
    setMessage(
      isHinglish
        ? "Please email aur password enter karo."
        : "Please enter your email and password."
    );
    return;
  }

  if (email === "admin@shop.com" && password === "123456") {
    onLogin();
  } else {
    setMessage(
      isHinglish
        ? "❌ Email ya password galat hai."
        : "❌ Incorrect email or password."
    );
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
          <span className="ai-badge">✨ AI POWERED</span>

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

          <div className="mobile-logo">🏪</div>

          <h2>
            {isHinglish ? "Welcome back! 👋" : "Welcome back! 👋"}
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
              />

              <button
                type="button"
                className="show-button"
                onClick={() => setShowPassword(!showPassword)}
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
                  {password.length >= 6 ? "Strong password" : "Weak password"}
                </small>
              </div>
            )}

            <div className="login-options">

              <label className="remember">
                <input type="checkbox" />
                Remember me
              </label>

              <button type="button" className="forgot">
                Forgot Password?
              </button>

            </div>

            {/* LOGIN */}
            <button className="login-button" type="submit">
              <span>🚀</span>
              {isHinglish ? "Login Karo" : "Login"}
              <span>→</span>
            </button>

          </form>

          {/* MESSAGE */}
          {message && (
            <div className="login-message">
              {message}
            </div>
          )}

          {/* DEMO */}
          <button
            type="button"
            className="demo-button"
            onClick={fillDemo}
          >
            ⚡ Try Demo Account
          </button>

          <p className="demo-info">
            Demo: admin@shop.com / 123456
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;