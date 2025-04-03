const API_URL = 'https://igbogbounion-backend.vercel.app/api';

export const sendWelcomeEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/send-welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending welcome email:', error);
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