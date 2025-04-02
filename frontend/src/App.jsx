import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { sendWelcomeEmail } from "../src/services/emailServices";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import AdminAnnouncement from '../src/components/AdminAnnouncement';

function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const q = query(collection(db, "waitlist"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("This email is already on the waitlist!");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "waitlist"), {
        email: email.toLowerCase().trim(),
        timestamp: new Date().toISOString(),
      });

      // Send welcome email
      await sendWelcomeEmail(email);

      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", err);
    }

    setLoading(false);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <div className="container">
              <div className="header">
                <h1>IGBOGBO STUDENT UNION</h1>
                <h1>Join the Waitlist</h1>
                <p>Be the first to know when we launch!</p>
              </div>
              <div className="form">
                <input
                  type="email"
                  className="email-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <button
                  className="submit-button"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Please wait..." : "Join Waitlist"}
                </button>
              </div>
              {error && <p className="error-message">{error}</p>}
              {submitted && !error && (
                <div className="success-container">
                  <p className="success-message">
                    🎉 Thank you for joining the waitlist!
                  </p>
                </div>
              )}
              <div className="footer">
                <p>Follow us on Twitter and Medium for updates.</p>
                <Link to="/admin" className="admin-link">Admin Panel</Link>
              </div>
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminAnnouncement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
