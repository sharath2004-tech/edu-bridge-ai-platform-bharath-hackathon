# 🔐 Offline Authentication System

## ✅ Complete Solution for Offline Access

Your EduBridge platform now supports **full offline authentication**! Students can login once online, then access their downloaded content without any internet connection.

---

## 🎯 How It Works

### **System Architecture:**

```
┌─────────────────────────────────────────────────┐
│         ONLINE (First Time)                     │
├─────────────────────────────────────────────────┤
│ 1. Student logs in at school (has WiFi)        │
│ 2. Server validates credentials                 │
│ 3. Session cookie created                       │
│ 4. Session cached to localStorage ✅            │
│ 5. Student downloads videos to IndexedDB        │
└─────────────────────────────────────────────────┘
                    ⬇️
┌─────────────────────────────────────────────────┐
│         OFFLINE (At Home)                       │
├─────────────────────────────────────────────────┤
│ 1. Student opens browser (no internet)         │
│ 2. Tries to access login page                  │
│ 3. Network error detected                       │
│ 4. Redirects to /offline-login                  │
│ 5. Checks localStorage for cached session      │
│ 6. Valid session found ✅                       │
│ 7. Grants access to /student/offline-videos    │
│ 8. Plays videos from IndexedDB                  │
└─────────────────────────────────────────────────┘
```

---

## 📂 Implementation Files

### **1. `lib/offline-auth.ts`** - Core Authentication Manager

```typescript
export class OfflineAuth {
  // Cache session after login
  static cacheSession(session: {
    userId: string
    role: string
    name: string
    email?: string
    schoolCode?: string
  }): void

  // Get cached session
  static getCachedSession(): OfflineSession | null

  // Check authentication status
  static isAuthenticated(): boolean

  // Clear cached session
  static clearSession(): void

  // Check if offline
  static isOffline(): boolean

  // Get user role
  static getUserRole(): string | null

  // Get dashboard URL
  static getDashboardUrl(role?: string): string

  // Check offline access permission
  static canAccessOffline(): boolean
}
```

**Session Storage:**
- **Key**: `edubridge_offline_session`
- **Location**: `localStorage`
- **Duration**: 7 days
- **Auto-expires**: Yes

---

### **2. `app/offline-login/page.tsx`** - Offline Login Page

**Features:**
- Detects offline status
- Shows cached user info
- Allows offline access
- Redirects when back online

**UI Elements:**
- User name and role display
- Session expiry date
- "Continue Offline" button
- Warning if no cached session

---

### **3. `app/login/page.tsx`** - Updated Login Page

**New Features:**
- Caches session after successful login
- Auto-redirects to `/offline-login` on network error
- Shows "Access Offline Content" button when offline

**Session Caching:**
```typescript
// After successful login
OfflineAuth.cacheSession({
  userId: data.data.id,
  role: data.data.role,
  name: data.data.name,
  email: data.data.email,
  schoolCode: schoolCode
})
```

---

### **4. `middleware.ts`** - Updated Middleware

**New Rules:**
- Allows `/offline-login` without authentication
- Allows `/student/offline-videos` without session
- Other routes still require authentication

**Code:**
```typescript
// Allow offline-login page always
if (pathname === '/offline-login') {
  return NextResponse.next()
}

// Allow offline videos page (uses IndexedDB only)
if (pathname === '/student/offline-videos') {
  return NextResponse.next()
}
```

---

### **5. `public/sw.js`** - Updated Service Worker

**Cached Pages:**
- `/` - Home page
- `/offline` - Offline fallback
- `/offline-login` - Offline login
- `/student/offline-videos` - Video library
- `/manifest.json` - PWA manifest

**Cache Version:** `edubridge-v3`

---

## 🚀 User Flow

### **Scenario 1: First Time Setup (Online)**

```
1. Student opens app at school (has WiFi) 📶
2. Goes to /login
3. Enters credentials:
   - School Code: ABC123
   - Email: student@school.com
   - Password: ********
4. Clicks "Sign In"
5. Server validates ✅
6. Session cached to localStorage 💾
7. Downloads videos to IndexedDB 📥
8. Ready for offline use! 🎉
```

---

### **Scenario 2: Offline Access (No Internet)**

```
1. Student opens browser at home (no internet) 🏠
2. Tries to go to /login
3. Network error occurs ⚠️
4. Auto-redirects to /offline-login
5. Page loads from service worker cache ✅
6. Shows cached session:
   Name: John Doe
   Role: Student
   Expires: Jan 23, 2026
7. Clicks "Continue Offline" button
8. Redirects to /student/offline-videos
9. Watches downloaded videos ▶️
10. No authentication required! 🎉
```

---

### **Scenario 3: Back Online**

```
1. Student reconnects to internet 📶
2. Offline login page detects online status
3. Auto-redirects to regular /login
4. Can login normally
5. Session refreshes in localStorage
6. Can download new videos
```

---

## 🎨 UI/UX Features

### **Offline Login Page:**

```
┌───────────────────────────────────────────┐
│          🔴 You're Offline                │
│                                           │
│       Offline Login                       │
│  You're offline, but you can still access │
│       downloaded content                  │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │ 👤 John Doe                         │ │
│  │    Student                           │ │
│  │    student@school.com               │ │
│  └─────────────────────────────────────┘ │
│                                           │
│  [📹 Continue Offline]                   │
│                                           │
│  Cached session expires: Jan 23, 2026    │
│                                           │
│  💡 Tip: Login online to cache session   │
└───────────────────────────────────────────┘
```

---

### **Login Page (When Offline):**

```
┌───────────────────────────────────────────┐
│          Welcome Back                     │
│  Sign in to continue learning             │
│                                           │
│  [School Code] [Role] [Email] [Password] │
│                                           │
│  [Sign In]                                │
│                                           │
│  ────────── Or continue with ──────────  │
│                                           │
│  [Google]  [GitHub]                      │
│                                           │
│  ─────────────────────────────────────── │
│  [🔴 Access Offline Content]             │
└───────────────────────────────────────────┘
```

---

## 🔒 Security Considerations

### **Session Storage:**
- ✅ Stored in localStorage (browser-specific)
- ✅ Auto-expires after 7 days
- ✅ No sensitive data (just user info)
- ✅ Can be cleared by user

### **Access Control:**
- ✅ Only `/student/offline-videos` accessible offline
- ✅ No API calls possible without network
- ✅ Videos stored locally (not shared)
- ✅ Session tied to specific browser

### **Privacy:**
- ✅ Session only stored on device
- ✅ Not transmitted anywhere
- ✅ Cleared when browser data cleared
- ✅ No password stored

---

## 📊 Session Lifecycle

```
┌─────────────────────────────────────────┐
│ Day 1: Login Online                     │
│ → Session cached (expires Day 8)        │
└─────────────────────────────────────────┘
         ⬇️
┌─────────────────────────────────────────┐
│ Day 2-7: Offline Access                 │
│ → Session valid, can access offline     │
└─────────────────────────────────────────┘
         ⬇️
┌─────────────────────────────────────────┐
│ Day 8: Session Expired                  │
│ → Must login online again                │
└─────────────────────────────────────────┘
```

---

## 🧪 Testing Instructions

### **Test 1: Cache Session (Online)**
```bash
1. Open http://localhost:3000/login
2. Login with valid credentials
3. Open browser DevTools (F12)
4. Go to Application → Storage → Local Storage
5. Find key: edubridge_offline_session
6. Should see JSON with user data ✅
```

### **Test 2: Offline Login**
```bash
1. Login once (as above)
2. Open DevTools (F12)
3. Go to Network tab
4. Check "Offline" checkbox
5. Navigate to /login (will fail)
6. Should auto-redirect to /offline-login ✅
7. Should show cached user info ✅
8. Click "Continue Offline"
9. Should go to /student/offline-videos ✅
```

### **Test 3: Expired Session**
```bash
1. Open DevTools → Application → Local Storage
2. Find edubridge_offline_session
3. Edit expiresAt to past date
4. Go to /offline-login
5. Should show "No cached session" error ✅
```

---

## 🛠️ Configuration

### **Session Duration:**
Located in `lib/offline-auth.ts`:
```typescript
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days
```

**To change:**
- 1 day: `1 * 24 * 60 * 60 * 1000`
- 30 days: `30 * 24 * 60 * 60 * 1000`
- Forever: `Number.MAX_SAFE_INTEGER` (not recommended)

---

### **Storage Key:**
```typescript
const STORAGE_KEY = 'edubridge_offline_session'
```

**To change:** Update in `offline-auth.ts`

---

## 🐛 Troubleshooting

### **Problem: "No cached session found"**

**Causes:**
1. Never logged in online before
2. Session expired (>7 days)
3. Browser data cleared
4. Using different browser

**Solution:**
- Login when online to cache session
- Check session expiry date
- Don't clear browser data

---

### **Problem: "Network error" on login**

**Causes:**
1. Actually offline
2. Server down
3. Firewall blocking

**Solution:**
- Check network connection
- Click "Access Offline Content" button
- Try /offline-login directly

---

### **Problem: Can't access offline videos**

**Causes:**
1. No videos downloaded
2. IndexedDB cleared
3. Wrong user session

**Solution:**
- Download videos when online first
- Check IndexedDB in DevTools
- Re-login and download again

---

## 📱 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| localStorage | ✅ | ✅ | ✅ | ✅ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| IndexedDB | ✅ | ✅ | ✅ | ✅ |
| Offline Detection | ✅ | ✅ | ✅ | ✅ |

**Minimum Versions:**
- Chrome 51+
- Firefox 44+
- Safari 11.1+
- Edge 17+

---

## 🔮 Future Enhancements

### **Planned:**
- [ ] Biometric offline login
- [ ] Multiple user profiles
- [ ] Offline sync queue
- [ ] Session refresh without re-login
- [ ] Offline analytics

### **Under Consideration:**
- [ ] Encrypted session storage
- [ ] PIN/password for offline access
- [ ] Auto-login offline mode
- [ ] Cross-device session sync

---

## 📞 Support

**For Students:**
- Login when online at least once
- Session lasts 7 days
- Videos must be downloaded beforehand
- Clear cache = lose offline access

**For Teachers:**
- Inform students about offline feature
- Recommend downloading at school
- Session expires after 7 days
- Students must re-login online

**For Developers:**
- Check `OfflineAuth` class for API
- Session stored in localStorage
- No backend changes needed
- Works with existing auth system

---

## ✅ Quick Start Checklist

- [ ] Student logins online (first time)
- [ ] Session cached to localStorage
- [ ] Student downloads videos to IndexedDB
- [ ] Goes offline (home)
- [ ] Tries to access /login
- [ ] Gets network error
- [ ] Redirects to /offline-login
- [ ] Shows cached session
- [ ] Clicks "Continue Offline"
- [ ] Accesses /student/offline-videos
- [ ] Watches videos from IndexedDB
- [ ] ✅ Complete offline access!

---

**Last Updated**: January 2025  
**Version**: 3.0 (Offline Authentication)  
**Status**: ✅ Production Ready
