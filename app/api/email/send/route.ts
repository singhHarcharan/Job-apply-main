import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/auth-options';

export async function POST(req: NextRequest) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be signed in to send emails' }, 
        { status: 401 }
      );
    }
    
    // Get request data
    const { to, subject, message } = await req.json();
    
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, or message' }, 
        { status: 400 }
      );
    }
    
    // Prepare the email content
    const emailContent = [
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      message
    ].join('\r\n');
    
    // Convert to base64 format required by Gmail API
    const base64EncodedEmail = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    // Send the email using Gmail API
    const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        raw: base64EncodedEmail
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gmail API error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to send email' }, 
        { status: response.status }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      messageId: result.id
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' }, 
      { status: 500 }
    );
  }
} 