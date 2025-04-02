import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import "./index.css";

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

      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", err);
    }

    setLoading(false);
  };

  return (
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
      </div>
    </div>
  );
}

export default App;
