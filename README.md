# Cold Email Outreach Tool

A powerful Next.js application designed for effective cold email outreach to recruiters, founders, and professionals, featuring Gmail integration for seamless email management.

## 🚀 Features

- 🔒 Secure Google OAuth authentication
- 📧 Gmail integration for sending cold emails
- 📊 Email tracking and management
- 💼 Template management for outreach campaigns
- 📈 Response tracking and analytics
- 🎨 Clean, modern UI with responsive design

## 🛠️ Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Google Cloud Project with OAuth 2.0 credentials

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Job-apply-main.git
cd Job-apply-main
```

### 2. Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Configuration
NEXTAUTH_SECRET=your_secure_random_string_here
NEXTAUTH_URL=http://localhost:3000

# Application Settings
NODE_ENV=development
```

#### Generate NEXTAUTH_SECRET

Run one of these commands to generate a secure random string:

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Set up Google OAuth for Gmail API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google+ API
   - Gmail API
4. Configure OAuth consent screen:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Set User Type to "External"
   - Fill in the required app information
   - Add the following scopes under "Scopes":
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `.../auth/gmail.send`
     - `.../auth/gmail.compose`
     - `.../auth/gmail.modify`
     - `https://mail.google.com/`
   - Add test users (for testing) or publish the app

5. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: Web application
   - Add authorized JavaScript origins:
     - `http://localhost:3000`
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://localhost:3000/api/auth/signin/google`
   - Click "Create"

6. Copy the Client ID and Client Secret to your `.env.local` file

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start using the application.

## 🔧 Troubleshooting

### Gmail API Errors
If you see an error about Gmail API not being enabled:
1. Go to [Google Cloud Console - Gmail API](https://console.developers.google.com/apis/api/gmail.googleapis.com/overview)
2. Click "Enable"
3. Wait 1-2 minutes for changes to propagate
4. Try signing in again

### OAuth Consent Screen
If you get consent screen errors:
1. Go to "APIs & Services" > "OAuth consent screen"
2. Make sure all required scopes are added
3. Ensure your app is in "Testing" or "Production" mode

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to a GitHub/GitLab repository
2. Import the project on [Vercel](https://vercel.com/new)
3. Add your environment variables in the Vercel project settings
4. Deploy!

### Environment Variables for Production
Update these in your production environment:
- `NEXTAUTH_URL` - Your production URL (e.g., `https://yourapp.vercel.app`)
- Update authorized JavaScript origins and redirect URIs in Google Cloud Console to include your production domain

## 💡 Best Practices for Cold Emailing

1. **Personalize** each email with the recipient's name and company
2. **Keep it concise** - get to the point quickly
3. **Include a clear call-to-action**
4. **Follow up** - but don't spam
5. **Track opens and clicks** to measure engagement

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📬 Support

For support or feature requests, please open an issue on the GitHub repository.
