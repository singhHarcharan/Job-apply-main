import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/auth-options';

 // eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be signed in to access email stats' }, 
        { status: 401 }
      );
    }
    
    // Fetch total message count
    const totalsResponse = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=1', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    });
    
    if (!totalsResponse.ok) {
      const errorData = await totalsResponse.json();
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch email stats' }, 
        { status: totalsResponse.status }
      );
    }
    
    const totalsData = await totalsResponse.json();
    
    // Fetch labels to get sent/draft counts
    const labelsResponse = await fetch('https://www.googleapis.com/gmail/v1/users/me/labels', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    });
    
    let sent = 0;
    let drafts = 0;
    
    if (labelsResponse.ok) {
      const labelsData = await labelsResponse.json();
      
      // Find SENT and DRAFT labels
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sentLabel = labelsData.labels?.find((label: any) => label.id === 'SENT');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const draftLabel = labelsData.labels?.find((label: any) => label.id === 'DRAFT');
      
      if (sentLabel) {
        const sentResponse = await fetch(`https://www.googleapis.com/gmail/v1/users/me/labels/${sentLabel.id}`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        });
        
        if (sentResponse.ok) {
          const sentData = await sentResponse.json();
          sent = sentData.messagesTotal || 0;
        }
      }
      
      if (draftLabel) {
        const draftResponse = await fetch(`https://www.googleapis.com/gmail/v1/users/me/labels/${draftLabel.id}`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        });
        
        if (draftResponse.ok) {
          const draftData = await draftResponse.json();
          drafts = draftData.messagesTotal || 0;
        }
      }
    }
    
    return NextResponse.json({
      total: totalsData.resultSizeEstimate || 0,
      sent,
      drafts,
      templates: 0 // Gmail doesn't have a built-in templates system
    });
  } catch (error) {
    console.error('Error fetching email stats:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' }, 
      { status: 500 }
    );
  }
} 