# Health Awareness Poster Generator

## Overview

This is a health awareness poster generator application designed for the Kirkuk Health Department in Iraq. Health workers can select pre-approved health topics and generate professional Arabic posters that can be downloaded as PDFs.

Key features:
- **User Authentication**: Registration and login system for health center staff
- **Approved Topics Library**: Ministry-approved health topics with pre-defined content
- **Poster Generation**: Professional A4 posters with official branding
- **Personal Archive**: History of all generated posters
- **Mobile App Ready**: Capacitor configured for Android APK generation

The application supports both portrait and landscape orientations for A4-sized posters, with RTL (right-to-left) text direction for Arabic content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animations**: Framer Motion for smooth transitions
- **PDF Generation**: html2canvas + jsPDF for converting poster to downloadable PDF
- **Fonts**: Cairo and Tajawal (Arabic-optimized fonts)
- **Mobile**: Capacitor for Android app packaging

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **Build Tool**: esbuild for server, Vite for client
- **API Pattern**: RESTful endpoints defined in shared route schemas with Zod validation
- **Authentication**: Express sessions with bcrypt password hashing

### Data Layer
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Schema Location**: `shared/schema.ts` - contains database schemas
- **Tables**:
  - `users`: User accounts with authentication
  - `approved_topics`: Ministry-approved health topics
  - `user_posters`: Archive of generated posters

### Key Design Patterns
1. **Shared Types**: The `shared/` directory contains schemas and route definitions used by both client and server, ensuring type safety across the stack
2. **API Schema Validation**: Zod schemas validate both request inputs and response formats
3. **Component Composition**: UI built from composable shadcn/ui primitives
4. **Session-based Auth**: Express sessions with PostgreSQL storage for secure authentication

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components including poster preview and generator form
    hooks/        # Custom React hooks (useAuth, useToast, etc.)
    pages/        # Page components (Home, Login, Register, Archive)
    lib/          # Utilities and query client
server/           # Express backend
  routes.ts       # API endpoint handlers
  storage.ts      # Database operations
  db.ts           # Database connection
  seed.ts         # Seed data for approved topics
shared/           # Shared code between client and server
  schema.ts       # Drizzle database schemas
android/          # Capacitor Android project
capacitor.config.ts  # Capacitor configuration
```

## API Routes

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Topics
- `GET /api/topics` - Get all approved health topics

### Posters
- `POST /api/posters` - Create new poster (authenticated)
- `GET /api/posters/archive` - Get user's poster archive (authenticated)

## External Dependencies

### Database
- **PostgreSQL**: Primary data store
- **Environment Variable**: `DATABASE_URL` for connection string
- **Session Store**: connect-pg-simple for Express sessions

### PDF Generation (Client-side)
- **html2canvas**: Captures DOM elements as canvas
- **jsPDF**: Generates PDF from canvas output

### Mobile App
- **Capacitor**: Cross-platform mobile app framework
- **Android**: Configured for APK generation
- **Build command**: `npm run build && npx cap sync android`

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `@tanstack/react-query`: Async state management
- `framer-motion`: Animation library
- `wouter`: Client-side routing
- `bcryptjs`: Password hashing
- `express-session`: Session management
- `@capacitor/core` / `@capacitor/android`: Mobile app packaging
- Full shadcn/ui component suite via Radix UI primitives

## Building for Android

### Prerequisites
- Android Studio installed on your local machine
- Java JDK 17+ installed
- Android SDK with API level 33+ installed

### Build Steps

1. **Build the web app**:
   ```bash
   npm run build
   ```

2. **Sync with Capacitor**:
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```
   Or manually open the `android/` folder in Android Studio.

4. **Build APK from Android Studio**:
   - Go to `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - Wait for the build to complete
   - APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`

5. **Build Signed Release APK** (for distribution):
   - Go to `Build > Generate Signed Bundle / APK`
   - Select `APK` and click Next
   - Create or select a keystore file
   - Enter keystore password and key alias
   - Select `release` build variant
   - APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### Configuration
The app is configured in `capacitor.config.ts`:
- **App ID**: `com.kirkuk.health.poster`
- **App Name**: `بوسترات صحية` (Health Posters)
- **Server URL**: Points to the deployed web app URL

### Important Notes
- The Android app is a WebView wrapper around the web application
- For offline functionality, additional PWA configuration would be needed
- Update the `server.url` in `capacitor.config.ts` to point to your production URL before building for release

## Recent Changes

### December 2024
- Added dark mode with theme toggle across all pages
- Added admin notifications panel showing new user registrations
- Added monthly reports section with poster statistics and top topics/centers
- Added print preview modal with full-size poster display
- Enhanced Dashboard with notifications and analytics for admins
- Added daily health tips feature with rotating content
