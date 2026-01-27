/**
 * Email service utilities for Gmail API interactions
 */

/**
 * Sends an email using the server-side API endpoint
 */
export async function sendEmail({
  to,
  subject,
  message,
}: {
  accessToken?: string; // No longer needed as we use server API
  to: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Use the server API endpoint instead of direct Gmail API call
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, message }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Gets email statistics from Gmail API
 */
export async function getEmailStats() {
  try {
    // Fetch messages to get counts
    const response = await fetch('/api/email/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to fetch email stats');
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching email stats:', error);
    return {
      total: 0,
      sent: 0, 
      drafts: 0,
      templates: 0
    };
  }
} 