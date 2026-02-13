# Admin Security Implementation - Setup Instructions

## 🔐 Security Implementation Complete

All critical security vulnerabilities have been addressed:

✅ **Server-side JWT authentication** - No more client-only auth  
✅ **Password protection** - No hard-coded passwords in code  
✅ **API route protection** - All destructive operations require auth  
✅ **Rate limiting** - Prevents brute-force attacks  
✅ **Session persistence** - Cookies with secure httpOnly flags

## Setup Instructions

### 1. Create Environment File

Copy the example environment file:
```bash
copy .env.local.example .env.local
```

### 2. Generate Secure JWT Secret

Run this command to generate a random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and paste it in `.env.local` as `JWT_SECRET`:
```env
JWT_SECRET=<paste-your-generated-secret-here>
```

### 3. Set Admin Password

**Option A - Development (NOT for production):**
```env
ADMIN_PASSWORD=your-secure-password
```

**Option B - Production (Recommended):**
Generate a password hash:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-secure-password', 10).then(console.log)"
```

Use the hash in `.env.local`:
```env
ADMIN_PASSWORD_HASH=$2a$10$...your-hash-here...
```

### 4. Restart Dev Server

After setting up `.env.local`, restart the server:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Testing the Security

### Test 1: Login
1. Go to `http://localhost:3000/admin`
2. Enter the password you set in `.env.local`
3. Should successfully log in

### Test 2: Session Persistence
1. After logging in, refresh the page
2. Should remain logged in (session persists)

### Test 3: Unauthorized API Access
1. Log out
2. Open browser DevTools Console
3. Try: `fetch('/api/news', {method: 'DELETE'})`
4. Should return 401 Unauthorized

### Test 4: Rate Limiting
1. Log out
2. Enter wrong password 5 times quickly
3. Should show "Too many attempts" error

## Security Features

- **JWT Tokens**: 7-day expiry, httpOnly cookies
- **Rate Limiting**: 5 attempts per 15 minutes
- **API Protection**: All POST/PUT/DELETE to `/api/news` require auth
- **Password Hashing**: bcrypt with 10 salt rounds
- **Secure Cookies**: httpOnly, sameSite=lax, secure in production

## Files Created

- `lib/admin-auth.ts` - JWT authentication utilities
- `lib/rate-limit.ts` - Rate limiting for login
- `lib/api-middleware.ts` - API protection middleware
- `app/api/auth/admin/login/route.ts` - Login endpoint
- `app/api/auth/admin/logout/route.ts` - Logout endpoint
- `app/api/auth/admin/verify/route.ts` - Session verification
- `.env.local.example` - Environment template

## Files Modified

- `app/admin/layout.tsx` - Server-side auth integration
- `app/api/news/route.ts` - Added auth protection

## Notes

⚠️ **Important**: The `.env.local` file contains secrets and should NEVER be committed to git. It's already in `.gitignore`.

🔒 **Production**: Make sure to use `ADMIN_PASSWORD_HASH` (not plain `ADMIN_PASSWORD`) in production and set a strong JWT_SECRET.

🛡️ **Additional Protection**: Club management routes (`/kulupler/[slug]/yonetim`) already have role-based authentication using the existing `auth.ts` system - they don't use the admin password.
