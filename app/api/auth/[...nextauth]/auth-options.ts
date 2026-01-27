import { NextAuthOptions, Session, Account, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

// Extend the built-in session type
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: 'RefreshAccessTokenError';
  }
}

// Configure Next-Auth with Google provider
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/gmail.compose',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://mail.google.com/'
          ].join(' '),
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: { token: JWT, account: Account | null, user: User | null }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
          user
        };
      }

      // Return the previous token if it hasn't expired
      if (token.expiresAt && Date.now() < (token.expiresAt as number * 1000)) {
        return token;
      }

      // Token has expired, try to refresh it
      try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID as string,
            client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken as string,
          }),
          method: 'POST',
        });

        const tokens = await response.json();

        if (!response.ok) throw tokens;

        return {
          ...token,
          accessToken: tokens.access_token,
          expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in),
        };
      } catch (error) {
        console.error('Error refreshing access token', error);
        // The error property will be used client-side to handle the refresh token error
        return { ...token, error: 'RefreshAccessTokenError' };
      }
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      if (token.error) {
        // If there was a refresh token error, pass it to the client
        session.error = token.error as 'RefreshAccessTokenError';
        console.log('Session has refresh token error:', token.error);
      }
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.expiresAt = token.expiresAt as number;
      if (token.user) session.user = token.user;
      
      // Log session status for debugging
      console.log('Session updated with token expiry:', new Date((token.expiresAt as number) * 1000).toISOString());
      return session;
    },
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/signin',
    newUser: '/admin/onboarding'
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn(message: Record<string, any>) {
      console.log('User signed in:', message);
    },
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signOut(message: Record<string, any>) {
      console.log('User signed out:', message);
    },
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session(message: Record<string, any>) {
      // Log session updates
      console.log('Session updated:', message);
    }
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
}; 