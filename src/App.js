import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Tracker from "./pages/Tracker";
import Category from "./pages/Category";
import GirlsAwareness from "./pages/GirlsAwareness";
import MenSupport from "./pages/MenSupport";
import Chatbot from "./pages/Chatbot";
import PCOSPage from "./pages/PCOSPage";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("cyclecare_token", token);

      fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const user = data.user;
            localStorage.setItem("cyclecare_logged_in", "true");
            localStorage.setItem(
              "cyclecare_user",
              JSON.stringify({
                name: user.name,
                email: user.email,
                isAdmin: user.email === "shifashoebsyed@gmail.com"
              })
            );
            localStorage.setItem(
              "cyclecare_is_admin",
              user.email === "shifashoebsyed@gmail.com" ? "true" : "false"
            );
            navigate("/category", { replace: true });
          } else {
            console.error("Failed to fetch user");
            navigate("/login");
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          navigate("/login");
        });
    }
  }, [location, navigate, API_URL]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/tracker" element={<Tracker />} />
      <Route path="/category" element={<Category />} />
      <Route path="/girls-awareness" element={<GirlsAwareness />} />
      <Route path="/men-support" element={<MenSupport />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/pcos-tracker" element={<PCOSPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;