# IHMS - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Both servers should be running

### Current Status
✅ **Backend**: Running on http://localhost:3001
✅ **Frontend**: Running on http://localhost:3000

---

## 🎨 Testing Dark/Light Mode

### Step 1: Access the Application
1. Open your browser
2. Navigate to: **http://localhost:3000**
3. You'll be redirected to the login page (due to authentication middleware)

### Step 2: Navigate to Settings
1. After logging in, go to the **Settings** page
2. Look for the **"Appearance"** section
3. You'll see the theme toggle with Sun/Moon icons

### Step 3: Toggle Theme
1. Click the toggle switch
2. Watch the smooth transition between light and dark modes
3. The theme preference is automatically saved

---

## 🔑 API Testing

### Test Appointments Endpoint
```bash
# This will return 401 Unauthorized (expected - shows endpoint is working)
curl http://localhost:3001/api/v1/appointments
```

### Test Profile Endpoint
```bash
# This will return 401 Unauthorized (expected - shows endpoint is working)
curl http://localhost:3001/api/v1/users/profile
```

### Test Medications Endpoint
```bash
# This will return 401 Unauthorized (expected - shows endpoint is working)
curl http://localhost:3001/api/v1/medications
```

**Note**: All endpoints return 401 because they require authentication. This confirms they're working correctly!

---

## 📱 Using the API Client

### In Your React Components

```typescript
import api from '@/lib/api';

// Example: Get user profile
async function loadProfile() {
  try {
    const profile = await api.users.getProfile();
    console.log(profile);
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
}

// Example: Create appointment
async function createAppointment() {
  try {
    const appointment = await api.appointments.create({
      type: 'checkup',
      provider: {
        name: 'Dr. Smith',
        specialty: 'Cardiology',
        phone: '555-0123',
        address: {
          street: '123 Medical Plaza',
          city: 'New York',
          state: 'NY',
          zip: '10001'
        }
      },
      scheduledAt: new Date('2026-03-15T14:00:00'),
      duration: 30,
      notes: 'Annual checkup'
    });
    console.log('Appointment created:', appointment);
  } catch (error) {
    console.error('Failed to create appointment:', error);
  }
}

// Example: Get all medications
async function loadMedications() {
  try {
    const medications = await api.medications.getAll(true); // active only
    console.log(medications);
  } catch (error) {
    console.error('Failed to load medications:', error);
  }
}

// Example: Update settings
async function updateThemePreference(theme: 'light' | 'dark') {
  try {
    await api.users.updateSettings({
      preferences: { theme }
    });
    console.log('Settings updated');
  } catch (error) {
    console.error('Failed to update settings:', error);
  }
}
```

---

## 🎨 Theme System Usage

### Accessing Theme State

```typescript
import { useThemeStore } from '@/lib/store';

function MyComponent() {
  const { themeMode, setThemeMode } = useThemeStore();
  
  return (
    <div>
      <p>Current theme: {themeMode}</p>
      <button onClick={() => setThemeMode('dark')}>
        Switch to Dark
      </button>
      <button onClick={() => setThemeMode('light')}>
        Switch to Light
      </button>
    </div>
  );
}
```

### Using Theme in CSS

```css
/* Your component will automatically adapt to theme */
.my-element {
  background: var(--background);
  color: var(--foreground);
  border-color: var(--primary);
}

/* Specific dark mode styles */
.dark .my-special-element {
  /* Only applies in dark mode */
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}
```

---

## 🔧 Troubleshooting

### Backend Not Responding
```bash
# Check if backend is running
curl http://localhost:3001/api/v1

# Should return 404 (means server is running)
```

### Frontend Not Loading
```bash
# Check if frontend is running
curl http://localhost:3000

# Should return HTML or redirect
```

### Theme Not Persisting
- Check browser console for errors
- Clear localStorage and try again:
  ```javascript
  localStorage.clear();
  location.reload();
  ```

### API Calls Failing
- Ensure you're logged in and have a valid token
- Check browser console for detailed error messages
- Verify backend is running on port 3001

---

## 📋 Available Features

### ✅ Working Features

**Backend**:
- ✅ User authentication (login, register)
- ✅ Two-factor authentication (2FA)
- ✅ Profile management
- ✅ Settings management
- ✅ Password change
- ✅ Medication CRUD
- ✅ Medication logging
- ✅ Appointment CRUD
- ✅ Appointment status updates

**Frontend**:
- ✅ Dark/Light mode toggle
- ✅ Theme persistence
- ✅ Smooth transitions
- ✅ Settings page
- ✅ API client
- ✅ Type-safe API calls

---

## 🎯 Next Steps

1. **Test the theme toggle** in the Settings page
2. **Wire up API calls** in your existing pages
3. **Add error handling** with toast notifications
4. **Implement loading states** for better UX
5. **Add form validation** for user inputs

---

## 📞 Need Help?

Check the detailed documentation in `IMPLEMENTATION_SUMMARY.md` for:
- Complete API endpoint list
- Theme system architecture
- Code examples
- Technical details

---

**Happy coding! 🎉**
