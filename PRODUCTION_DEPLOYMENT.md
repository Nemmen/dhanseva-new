# Production Deployment Checklist

## Configuration Changes Applied

### Backend (Node.js on Vercel)
✅ Cookie configuration:
- `httpOnly: true`
- `secure: true` 
- `sameSite: 'none'`
- `domain: '.dhansevaindia.com'`

✅ CORS configuration:
- Allowed origins: `https://dhansevaindia.com`, `https://www.dhansevaindia.com`
- `credentials: true`
- `exposedHeaders: ['set-cookie']`

### Frontend (Next.js on Vercel)
✅ API configuration:
- `NEXT_PUBLIC_API_BASE_URL=https://api.dhansevaindia.com/api`
- `withCredentials: true` (already set in axios)

## Deployment Steps

### 1. Backend Deployment (Vercel)
```bash
cd backend
npm run build
git add .
git commit -m "Configure cookies for production with proper domain"
git push origin main
```

**Vercel Environment Variables (Required):**
```
NODE_ENV=production
CORS_ORIGIN=https://www.dhansevaindia.com
DATABASE_URL=postgresql://postgres.oxocjhhyidngaluxvsqz:dhanseva-trial-db@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.oxocjhhyidngaluxvsqz:dhanseva-trial-db@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
JWT_SECRET=<your-secret>
SESSION_SECRET=<your-secret>
# ... all other env vars
```

**Vercel Domain Setup:**
1. Go to Vercel project settings → Domains
2. Add custom domain: `api.dhansevaindia.com`
3. Follow Vercel's instructions to add CNAME record in your DNS:
   ```
   Type: CNAME
   Name: api
   Value: cname.vercel-dns.com
   ```

### 2. Frontend Deployment (Vercel)
```bash
cd Finance-web-master
npm run build
git add .
git commit -m "Update API URL to use production domain"
git push origin main
```

**Vercel Environment Variables (Required):**
```
NEXT_PUBLIC_API_BASE_URL=https://api.dhansevaindia.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_Rr5VUBDcqjo2dh
```

**Vercel Domain Setup:**
1. Frontend should be on: `dhansevaindia.com` and `www.dhansevaindia.com`
2. Ensure both domains are added in Vercel

## Verification Steps

### 1. Test Cookie Setting
1. Open Chrome DevTools → Network tab
2. Navigate to `https://dhansevaindia.com/login`
3. Login with credentials
4. Find the login request and check Response Headers:
   ```
   Set-Cookie: dhanseva_token=<token>; Domain=.dhansevaindia.com; Path=/; HttpOnly; Secure; SameSite=None
   ```

### 2. Test Cookie Sending
1. After login, navigate to `https://dhansevaindia.com/profile`
2. Open DevTools → Network tab
3. Check any API request → Request Headers:
   ```
   Cookie: dhanseva_token=<token>
   ```

### 3. Test Authentication
1. Login at `https://dhansevaindia.com/login`
2. Navigate to `https://dhansevaindia.com/apply/personal-loan`
3. Should NOT redirect to login
4. Should show authenticated content

## Troubleshooting

### Issue: Cookie not being set
**Check:**
- Backend is deployed to `api.dhansevaindia.com` (not vercel.app)
- `NODE_ENV=production` is set in Vercel
- Browser console shows no CORS errors

### Issue: Cookie not being sent
**Check:**
- Frontend environment variable: `NEXT_PUBLIC_API_BASE_URL=https://api.dhansevaindia.com/api`
- Both domains use HTTPS
- Cookie domain is `.dhansevaindia.com` (with leading dot)

### Issue: CORS errors
**Check:**
- Backend CORS allows `https://dhansevaindia.com` and `https://www.dhansevaindia.com`
- `credentials: true` is set in CORS config
- Frontend axios has `withCredentials: true`

## Browser Compatibility
✅ Chrome/Edge (v80+)
✅ Firefox (v69+)
✅ Safari (v13+)
✅ Brave

## Security Notes
- ✅ `httpOnly` prevents XSS attacks
- ✅ `secure` ensures HTTPS-only transmission
- ✅ `sameSite: 'none'` with `secure: true` allows cross-site cookies safely
- ✅ Domain set to `.dhansevaindia.com` limits cookie to your domain only
- ✅ No wildcard CORS origins used

## Post-Deployment
After successful deployment:
1. Test all authentication flows
2. Test apply service workflow
3. Test profile access
4. Test DSA/Employee dashboards
5. Monitor Vercel logs for any cookie-related errors
