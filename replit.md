# Health Awareness Poster Generator

## Overview

This is a health awareness poster generator application designed for Iraqi health departments. Users can input a health topic and their health center name, and the application uses AI (OpenAI) to generate Arabic health awareness content. The generated content is displayed in a professional poster format that can be downloaded as a PDF.

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

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **Build Tool**: esbuild for server, Vite for client
- **API Pattern**: RESTful endpoints defined in shared route schemas with Zod validation

### Data Layer
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Schema Location**: `shared/schema.ts` - contains poster storage schema
- **Migrations**: Drizzle Kit with `db:push` command

### Key Design Patterns
1. **Shared Types**: The `shared/` directory contains schemas and route definitions used by both client and server, ensuring type safety across the stack
2. **API Schema Validation**: Zod schemas validate both request inputs and response formats
3. **Component Composition**: UI built from composable shadcn/ui primitives

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components including poster preview and generator form
    hooks/        # Custom React hooks
    pages/        # Page components
    lib/          # Utilities and query client
server/           # Express backend
  routes.ts       # API endpoint handlers
  storage.ts      # Database operations
  db.ts           # Database connection
shared/           # Shared code between client and server
  schema.ts       # Drizzle database schemas
  routes.ts       # API route definitions with Zod schemas
```

## External Dependencies

### AI Integration
- **OpenAI API**: Used for generating health awareness content in Arabic
- **Environment Variables**: `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` for API configuration
- **Model**: gpt-5.1 for text generation

### Database
- **PostgreSQL**: Primary data store
- **Environment Variable**: `DATABASE_URL` for connection string
- **Session Store**: connect-pg-simple for Express sessions

### PDF Generation (Client-side)
- **html2canvas**: Captures DOM elements as canvas
- **jsPDF**: Generates PDF from canvas output

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `@tanstack/react-query`: Async state management
- `framer-motion`: Animation library
- `wouter`: Client-side routing
- Full shadcn/ui component suite via Radix UI primitives