const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const sendWelcomeEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/send-welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const sendAnnouncement = async (emails, subject, message) => {
  try {
    const response = await fetch(`${API_URL}/send-announcement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emails, subject, message })
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};