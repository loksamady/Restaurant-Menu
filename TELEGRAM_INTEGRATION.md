# Telegram Mini App Integration

This document describes the implementation of Telegram Mini App integration in the Restaurant Menu application.

## Overview

The application now integrates with Telegram Mini App using the `@twa-dev/sdk` package to fetch user data directly from Telegram and provide a seamless experience within the Telegram ecosystem.

## Files Created/Modified

### 1. Telegram Utility (`src/util/telegramUtil.ts`)

**Purpose**: Centralized utility functions for Telegram WebApp operations

**Key Features**:

- Initialize Telegram WebApp with proper configuration
- Fetch user data from Telegram
- Manage WebApp appearance (theme, header, background)
- Handle main button and back button operations
- Provide haptic feedback
- Send data to Telegram bot
- Show alerts and confirmations
- Mock data for development

**Main Functions**:

- `initializeTelegramWebApp()` - Initialize and configure WebApp
- `getTelegramUser()` - Get current user data
- `isTelegramWebApp()` - Check if running in Telegram
- `showMainButton()` / `hideMainButton()` - Control main button
- `triggerHapticFeedback()` - Provide tactile feedback
- `getMockTelegramUser()` - Fallback data for development

### 2. Telegram WebApp Hook (`src/hooks/useTelegramWebApp.tsx`)

**Purpose**: React hook for managing Telegram WebApp state

**Features**:

- Automatic initialization on component mount
- Loading and error state management
- User data fetching with fallback to mock data
- Theme detection (light/dark)
- Type-safe interface

**Returns**:

```typescript
{
  user: TelegramUser | null;
  isReady: boolean;
  isLoading: boolean;
  isTelegram: boolean;
  colorScheme: "light" | "dark";
  initData: any;
  error: string | null;
}
```

### 3. Updated User Component (`src/components/user/User.tsx`)

**Purpose**: User avatar/profile component with Telegram integration

**Changes**:

- Replaced mock data with Telegram WebApp hook
- Added loading state while initializing
- Display Telegram user avatar or initials
- Improved tooltip with real user name
- Error handling with fallback

**Features**:

- Shows user's Telegram profile photo if available
- Falls back to initials if no photo
- Loading spinner during initialization
- Graceful error handling

### 4. Updated UserProfile Component (`src/components/user/UserProfile.tsx`)

**Purpose**: User profile dialog with Telegram user data

**Changes**:

- Added `telegramUser` prop to receive Telegram data
- Updated user object to use Telegram data when available
- Added support for username and language code
- Premium status indicator

**New Props**:

```typescript
interface UserProfileProps {
  visible: boolean;
  onHide: () => void;
  initialActiveTab?: number;
  telegramUser?: TelegramUser | null;
}
```

## Telegram User Interface

```typescript
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}
```

## Usage Examples

### Basic Usage

```typescript
import { useTelegramWebApp } from "@src/hooks/useTelegramWebApp";

const MyComponent = () => {
  const { user, isReady, isLoading, error } = useTelegramWebApp();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>Hello, {user?.first_name}!</div>;
};
```

### Manual Utility Usage

```typescript
import {
  initializeTelegramWebApp,
  getTelegramUser,
  showMainButton,
} from "@src/util/telegramUtil";

// Initialize WebApp
initializeTelegramWebApp();

// Get user data
const user = getTelegramUser();

// Show main button
showMainButton("Order Now", () => {
  // Handle order action
});
```

## Development vs Production

### Development Mode

- When not running in Telegram WebApp environment
- Falls back to mock user data
- All features work with test data
- Console logs indicate mock data usage

### Production Mode (Telegram)

- Automatically detects Telegram WebApp environment
- Fetches real user data from Telegram
- Configures WebApp appearance
- Enables Telegram-specific features

## Configuration

### WebApp Settings

- Header color: `#ffffff` (white)
- Background color: `#f8f9fa` (light gray)
- Expanded to full height
- Closing confirmation enabled

### Theme Support

- Automatic light/dark theme detection
- Theme change listeners (where supported)
- Graceful fallback to light theme

## Error Handling

1. **Initialization Errors**: Falls back to mock data
2. **User Data Errors**: Uses fallback user object
3. **SDK Errors**: Graceful degradation with console logging
4. **Network Issues**: Local fallback mechanisms

## Testing

### In Development

1. Start dev server: `npm run dev`
2. Open browser: `http://localhost:3002`
3. Should see mock user "John Doe"
4. All features work with test data

### In Telegram

1. Deploy to HTTPS endpoint
2. Configure Telegram Bot with WebApp URL
3. Open in Telegram
4. Real user data should load

## Security Notes

- User data validation implemented
- No sensitive data stored locally
- Telegram's built-in security used
- Hash validation for init data (can be implemented)

## Future Enhancements

1. **Hash Validation**: Verify init data authenticity
2. **Bot Integration**: Send order data to Telegram bot
3. **Payment Integration**: Telegram Payments API
4. **Notification**: Using Telegram notifications
5. **Deep Linking**: Handle start parameters
6. **Geolocation**: Access user location through Telegram

## Dependencies

- `@twa-dev/sdk`: Telegram WebApp SDK
- `react`: React framework
- `primereact`: UI components
- TypeScript support included

## API Reference

See `src/util/telegramUtil.ts` for complete API documentation with TypeScript interfaces and function signatures.
