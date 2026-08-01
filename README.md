# RESTNEST Frontend

RESTNEST is a role-based rental property marketplace where tenants can discover properties and manage rentals, landlords can manage listings and rental requests, and administrators can oversee users and marketplace activity.

## Core Features

### Public Marketplace

- Responsive property discovery interface
- Search and filtering by location, price, category, and availability
- Property details with images, amenities, landlord information, ratings, and reviews
- Light and dark themes
- Accessible loading, empty, error, and not-found states

### Authentication

- Tenant and landlord registration
- Secure login and logout
- HTTP-only cookie-based frontend session handling
- Role-based dashboard protection
- Automatic dashboard redirection according to account role

### Tenant Features

- Submit rental requests
- Track pending, approved, rejected, active, completed, and cancelled rentals
- Complete approved payments through Stripe Checkout
- Resume pending Stripe Checkout sessions
- View payment status
- Submit eligible property ratings and reviews

### Landlord Features

- Create property listings
- Edit listing information
- Change property availability
- Delete eligible properties
- Review incoming tenant requests
- Approve or reject pending requests
- Monitor property and rental activity

### Administrator Features

- Review platform-wide user and property totals
- Search and filter users
- Activate or ban eligible user accounts
- Protect the currently signed-in administrator account
- Search and filter all property listings
- Inspect landlord and property information

## Technology Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- TanStack React Query
- React Hook Form
- Zod
- Ark UI
- Lucide React
- next-themes
- Stripe Checkout integration through the RESTNEST backend

## Project Structure

```text
restnest-client/
├── app/
│   ├── (public)/
│   ├── api/
│   ├── dashboard/
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── globals.css
│   ├── icon.svg
│   ├── layout.tsx
│   ├── loading.tsx
│   └── not-found.tsx
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── home/
│   ├── layout/
│   ├── payment/
│   ├── properties/
│   └── ui/
├── hooks/
├── lib/
│   ├── api/
│   ├── auth/
│   ├── properties/
│   └── validation/
├── public/
│   └── property-placeholder.svg
├── types/
├── API_INTEGRATION.md
├── next.config.ts
└── package.json
```

## Prerequisites

Install the following before running the project:

- Node.js 20 or later
- npm

## Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Configure the backend API URL:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api-url
```

⚠️ Do not add a trailing slash.

Example:

```env
NEXT_PUBLIC_API_BASE_URL=https://restnest-backend.vercel.app
```

## Installation

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run lint
```

Runs ESLint across the frontend project.

```bash
npm run build
```

Creates a production build and checks route compilation.

```bash
npm run start
```

Starts the compiled production application.

## Main Routes

### Public Routes

```text
/
 /properties
 /properties/[id]
 /auth/login
 /auth/register
 /payment/success
 /payment/cancel
```

### Tenant Routes

```text
/dashboard/tenant
/dashboard/tenant/rentals
```

### Landlord Routes

```text
/dashboard/landlord
/dashboard/landlord/properties
/dashboard/landlord/properties/new
/dashboard/landlord/properties/[id]/edit
/dashboard/landlord/requests
```

### Administrator Routes

```text
/dashboard/admin
/dashboard/admin/users
/dashboard/admin/properties
```

## Role-Based Access

RESTNEST supports three user roles:

| Role | Main Responsibilities |
| --- | --- |
| `TENANT` | Browse properties, submit requests, pay rent, and submit reviews |
| `LANDLORD` | Manage properties and respond to tenant requests |
| `ADMIN` | Manage users and inspect marketplace properties |

Protected dashboard layouts validate the authenticated user and required role before rendering dashboard content.

## Authentication Architecture

The browser communicates with frontend route handlers under `/api`.

After successful login:

1. The frontend route handler sends the credentials to the RESTNEST backend.
2. The backend returns an access token and user information.
3. The frontend stores the token in an HTTP-only cookie.
4. Protected frontend route handlers read the cookie server-side.
5. The token is forwarded to protected backend endpoints as a Bearer token.

The access token is not stored in local storage.

## API Integration

Complete frontend API integration documentation is available in:

```text
API_INTEGRATION.md
```

## Validation and Error Handling

The frontend uses React Hook Form and Zod for form validation.

API errors may be presented through:

- Inline form errors
- Semantic alert panels
- Ark UI toast notifications
- Route-level error boundaries
- Global application error boundaries

## Quality Verification

Before committing or deploying changes, run:

```bash
npm run lint
npm run build
```

Important flows should also be tested manually:

- Registration and login
- Role-based dashboard redirects
- Property browsing and filtering
- Tenant rental request submission
- Landlord request approval and rejection
- Stripe Checkout success and cancellation
- Tenant review submission
- Landlord property CRUD
- Administrator account-status management
- Mobile responsiveness
- Light and dark themes

## Related Repository

RESTNEST backend:

```text
https://github.com/RizBits14/restnest-backend
```
