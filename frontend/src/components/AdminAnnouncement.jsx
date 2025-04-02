import { useState, useEffect} from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { sendAnnouncement, sendWelcomeEmail } from '../services/emailServices';
import {useAuth} from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminAnnouncement() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [subscribers, setSubscribers] = useState([]);
  const {logout} = useAuth();
    const navigate = useNavigate();

  
  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "waitlist"));
      const emails = querySnapshot.docs.map(doc => doc.data().email);
      setSubscribers(emails);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  };

  const handleSendAnnouncement = async () => {
    if (!subject || !message) {
      setStatus('Please fill in all fields');
      return;
    }

    setSending(true);
    setStatus('Sending announcement...');

    try {
      await sendAnnouncement(subscribers, subject, message);
      setStatus('Announcement sent successfully!');
      setSubject('');
      setMessage('');
    } catch (error) {
      setStatus('Failed to send announcement');
      console.error('Error:', error);
    }

    setSending(false);
  };

  const handleSendWelcome = async () => {
    if (!selectedEmail) {
      setStatus('Please select an email');
      return;
    }

    setSending(true);
    setStatus('Sending welcome email...');

    try {
      await sendWelcomeEmail(selectedEmail);
      setStatus('Welcome email sent successfully!');
      setSelectedEmail('');
    } catch (error) {
      setStatus('Failed to send welcome email');
      console.error('Error:', error);
    }

    setSending(false);
  };


  const handleLogout = async () => {
    try {
        await logout();
        navigate('/login')
    } catch (error) {
        console.error('Failed to logout:', error)
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
      
      {/* Welcome Email Section */}
      <div className="welcome-email-section">
        <h3>Send Welcome Email</h3>
        <select 
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
          disabled={sending}
        >
          <option value="">Select subscriber</option>
          {subscribers.map((email, index) => (
            <option key={index} value={email}>{email}</option>
          ))}
        </select>
        <button 
          onClick={handleSendWelcome} 
          disabled={sending || !selectedEmail}
        >
          Send Welcome Email
        </button>
      </div>

      {/* Announcement Section */}
      <div className="announcement-section">
        <h3>Send Announcement</h3>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={sending}
        />
        <textarea
          placeholder="Message (HTML supported)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={sending}
        />
        <button 
          onClick={handleSendAnnouncement} 
          disabled={sending || !subject || !message}
        >
          {sending ? 'Sending...' : 'Send Announcement'}
        </button>
      </div>

      {status && <p className="status-message">{status}</p>}
    </div>
  );
}

export default AdminAnnouncement;