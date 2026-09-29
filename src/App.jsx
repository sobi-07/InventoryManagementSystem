import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "./firebase.js";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import AIAssistant from "./pages/AIAssistant";
import Reports from "./pages/Reports";
import Account from "./pages/Account";
import Settings from "./pages/Settings";

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [page, setPage] = useState("dashboard");

  // =========================================
  // FIREBASE AUTH STATE
  // =========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (
          currentUser &&
          currentUser.emailVerified
        ) {
          setUser(currentUser);

          try {
            const userDoc = await getDoc(
              doc(db, "users", currentUser.uid)
            );

            if (userDoc.exists()) {
              const userData = userDoc.data();

              setUserRole(
                userData.role || "staff"
              );
            } else {
              setUserRole("staff");
            }
          } catch (error) {
            console.error(
              "Error loading user role:",
              error
            );

            setUserRole("staff");
          }
        } else {
          setUser(null);
          setUserRole(null);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = async () => {
    try {
      await signOut(auth);

      setUser(null);
      setUserRole(null);
      setPage("dashboard");
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          color: "#1f2937",
        }}
      >
        Loading ShopManager...
      </div>
    );
  }

  // =========================================
  // LOGIN / SIGNUP
  // =========================================

  if (!user) {
    if (showSignup) {
      return (
        <Signup
          onSignupSuccess={() => {
            setShowSignup(false);
          }}
          onBackToLogin={() => {
            setShowSignup(false);
          }}
        />
      );
    }

    return (
      <Login
        onLogin={() => {}}
        onSignup={() => {
          setShowSignup(true);
        }}
      />
    );
  }

  // =========================================
  // WAIT FOR ROLE
  // =========================================

  if (userRole === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          color: "#1f2937",
        }}
      >
        Loading your account...
      </div>
    );
  }

  // =========================================
  // ACCOUNT
  // =========================================

  if (page === "account") {
    return (
      <Account
        user={user}
        userRole={userRole}
        onBack={() => {
          setPage("dashboard");
        }}
        onLogout={handleLogout}
      />
    );
  }

  // =========================================
  // SETTINGS
  // =========================================

  if (page === "settings") {
    return (
      <Settings
        user={user}
        userRole={userRole}
        onBack={() => {
          setPage("dashboard");
        }}
      />
    );
  }

  // =========================================
  // ANALYTICS - OWNER ONLY
  // =========================================

  if (
    page === "analytics" &&
    userRole === "owner"
  ) {
    return (
      <Analytics
        onBack={() => {
          setPage("dashboard");
        }}
      />
    );
  }

  // =========================================
  // AI ASSISTANT
  // =========================================

  if (page === "ai") {
    return (
      <AIAssistant
        onBack={() => {
          setPage("dashboard");
        }}
      />
    );
  }

  // =========================================
  // REPORTS - OWNER ONLY
  // =========================================

  if (
    page === "reports" &&
    userRole === "owner"
  ) {
    return (
      <Reports
        onBack={() => {
          setPage("dashboard");
        }}
      />
    );
  }

  // =========================================
  // DASHBOARD
  // =========================================

  return (
    <Dashboard
      user={user}
      userRole={userRole}
      onLogout={handleLogout}

      onAnalytics={() => {
        if (userRole === "owner") {
          setPage("analytics");
        }
      }}

      onAI={() => {
        setPage("ai");
      }}

      onReports={() => {
        if (userRole === "owner") {
          setPage("reports");
        }
      }}

      onAccount={() => {
        setPage("account");
      }}

      onSettings={() => {
        setPage("settings");
      }}
    />
  );
}

export default App;