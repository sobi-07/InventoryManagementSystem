import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import AIAssistant from "./pages/AIAssistant";
import Reports from "./pages/Reports";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  if (page === "analytics") {
    return <Analytics onBack={() => setPage("dashboard")} />;
  }

  if (page === "ai") {
    return <AIAssistant onBack={() => setPage("dashboard")} />;
  }

  if (page === "reports") {
    return <Reports onBack={() => setPage("dashboard")} />;
  }

  return (
    <Dashboard
      onLogout={() => setIsLoggedIn(false)}
      onAnalytics={() => setPage("analytics")}
      onAI={() => setPage("ai")}
      onReports={() => setPage("reports")}
    />
  );
}

export default App;