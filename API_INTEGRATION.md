# RESTNEST Frontend API Integration

## 1. Overview

RESTNEST uses a Next.js frontend with an Express/Prisma backend.

The frontend communicates with the backend through two request patterns:

1. **Direct public requests** for public marketplace information
2. **Next.js route-handler requests** for authentication and protected operations

Protected browser requests are sent to frontend route handlers under:

```text
/app/api
```

These route handlers read the authentication token from an HTTP-only cookie and forward it to the RESTNEST backend.

This keeps the raw backend access token unavailable to client-side JavaScript.

---

## 2. Environment Configuration

The frontend backend base URL is configured using:

```env
NEXT_PUBLIC_API_BASE_URL=
```

The value must include the backend `/api` prefix.

### Local development

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### Production deployment

```env
NEXT_PUBLIC_API_BASE_URL=https://restnest-backend.vercel.app/api
```

Do not use:

```env
NEXT_PUBLIC_API_BASE_URL=https://restnest-backend.vercel.app
```

The `/api` suffix is required because frontend services append endpoint paths such as:

```text
/auth/login
/properties
/rentals
/admin/users
```

The configuration is read from:

```text
lib/config.ts
```

Trailing slashes are normalized.

After changing `.env.local`, restart the frontend development server:

```bash
npm run dev
```

---

## 3. Request Architecture

### Public requests

Some public marketplace services communicate directly with the configured backend URL.

Example:

```text
Configured base:
http://localhost:5000/api

Requested path:
/properties

Resolved request:
http://localhost:5000/api/properties
```

### Protected requests

Protected browser requests are first sent to the Next.js frontend.

Example:

```text
Browser request:
POST /api/rentals

Frontend route handler:
app/api/rentals/route.ts

Backend request:
POST http://localhost:5000/api/rentals
```

The frontend route handler:

1. Reads the authentication cookie.
2. Extracts the backend access token.
3. Adds the Bearer token to the backend request.
4. Forwards the response to the browser.

---

## 4. Standard API Response Contract

Successful RESTNEST backend responses generally follow:

```ts
type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data?: T;
};
```

Failed responses generally follow:

```ts
type ApiErrorResponse = {
  success: false;
  message: string;
  errorDetails?: unknown;
};
```

The reusable backend API client is located at:

```text
lib/api/api-client.ts
```

It provides:

- Backend URL construction
- JSON request serialization
- JSON response parsing
- `Accept: application/json`
- `Content-Type: application/json`
- Optional Bearer-token authorization
- Network-error handling
- HTTP status-based errors
- Unexpected response handling

---

# 5. Authentication Integration

## 5.1 Login

### Browser request

```http
POST /api/auth/login
```

### Backend request

```http
POST /api/auth/login
```

### Request body

```json
{
  "email": "user@example.com",
  "password": "secure-password"
}
```

After a successful backend response, the frontend route handler:

1. Receives the backend access token.
2. Stores the token in an HTTP-only cookie.
3. Returns the authenticated user to the browser.
4. Does not expose the raw access token to client components.

After login, the frontend clears cached data from any previously authenticated account before storing the new session.

This prevents tenant, landlord, or administrator data from crossing between accounts.

---

## 5.2 Registration

### Browser request

```http
POST /api/auth/register
```

### Backend request

```http
POST /api/auth/register
```

### Request body

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "secure-password",
  "role": "TENANT",
  "phone": "+8801000000000"
}
```

Supported public registration roles:

```text
TENANT
LANDLORD
```

The administrator role cannot be selected through public registration.

The `phone` value is optional when supported by frontend validation.

---

## 5.3 Session Verification

### Browser request

```http
GET /api/auth/session
```

### Backend request

```http
GET /api/auth/me
```

The frontend route handler reads the HTTP-only authentication cookie and forwards its token as:

```http
Authorization: Bearer <access-token>
```

A backend `401` response is treated as an unauthenticated session.

---

## 5.4 Logout

### Browser request

```http
POST /api/auth/logout
```

Logout:

1. Clears the frontend authentication cookie.
2. Clears authenticated React Query data.
3. Resets the session query.
4. Redirects the user to the public application.

Clearing the full authenticated query cache prevents one account’s private data from being displayed after another account signs in.

---

# 6. Public Marketplace Integration

## 6.1 Categories

Frontend service:

```text
lib/api/categories.ts
```

Resolved backend request:

```http
GET /api/categories
```

Categories are used by:

- Public property filters
- Landlord property creation
- Landlord property editing
- Administrative property filtering

---

## 6.2 Property Collection

Frontend service:

```text
lib/api/properties.ts
```

Resolved backend request:

```http
GET /api/properties
```

Optional query parameters:

| Parameter | Type | Purpose |
|---|---|---|
| `location` | string | Search properties by location |
| `minPrice` | number | Set minimum property price |
| `maxPrice` | number | Set maximum property price |
| `categoryId` | string | Filter by category |
| `status` | enum | Filter by property status |

Supported property statuses:

```text
AVAILABLE
RENTED
UNAVAILABLE
```

Example:

```http
GET /api/properties?location=Dhaka&minPrice=500&maxPrice=2500&status=AVAILABLE
```

The public property browser requests only available properties by default.

The property query:

- Displays skeleton cards during initial loading
- Preserves existing cards during filter changes
- Shows a visible refresh indicator
- Refetches when the property browser remounts
- Refetches when the browser window regains focus

---

## 6.3 Property Details

### Browser request

```http
GET /api/properties/:propertyId
```

### Backend request

```http
GET /api/properties/:propertyId
```

Frontend service:

```text
lib/api/property-details-client.ts
```

The property-details response is used for:

- Property title
- Description
- Images
- Price
- Location
- Address
- Bedrooms
- Bathrooms
- Area
- Amenities
- Property category
- Property availability
- Landlord information
- Average rating
- Published reviews
- Tenant rental-request eligibility

Invalid or unavailable image URLs use:

```text
/public/property-placeholder.svg
```

---

# 7. Tenant Integration

Tenant endpoints require an authenticated user with the role:

```text
TENANT
```

## 7.1 Get Tenant Rentals

### Browser request

```http
GET /api/rentals
```

### Backend request

```http
GET /api/rentals
```

Frontend service:

```text
lib/api/tenant-rentals-client.ts
```

React Query key:

```ts
["tenant", "rentals"]
```

The tenant-rentals query is cleared whenever the authenticated account changes.

The property rental-request form also performs an authoritative tenant-rental refetch when it mounts. This ensures that duplicate-request eligibility is calculated for the currently signed-in tenant.

---

## 7.2 Create Rental Request

### Browser request

```http
POST /api/rentals
```

### Backend request

```http
POST /api/rentals
```

### Request body

```json
{
  "propertyId": "property-id",
  "moveInDate": "2026-08-15T00:00:00.000Z",
  "duration": 12,
  "message": "Optional tenant message"
}
```

Validation requirements:

- `propertyId` must be present.
- `moveInDate` must be a valid future date when required.
- `duration` must be a positive integer.
- `message` is optional.

After successful submission, the frontend immediately inserts the created request into the tenant-rentals cache.

This closes the property request form without requiring a page refresh.

The query is then invalidated so the canonical backend state can be retrieved.

Duplicate rental requests for the same tenant and property are blocked according to backend rental-request rules.

---

## 7.3 Tenant Rental Statuses

Supported rental-request statuses include:

```text
PENDING
APPROVED
REJECTED
ACTIVE
COMPLETED
CANCELLED
```

The frontend uses these statuses to decide whether to show:

- Pending information
- Payment controls
- Rejection information
- Active-rental information
- Review controls
- Completed-review information
- Cancellation information

---

# 8. Stripe Payment Integration

## 8.1 Create or Continue Checkout

### Browser request

```http
POST /api/payments/create
```

### Backend request

```http
POST /api/payments/create
```

### Request body

```json
{
  "rentalRequestId": "rental-request-id"
}
```

The response contains:

```ts
type PaymentCheckoutResponse = {
  paymentUrl: string;
};
```

The browser redirects to the Stripe-hosted Checkout URL.

If an incomplete Stripe Checkout session already exists, the backend may return the existing payment URL so the tenant can continue payment.

---

## 8.2 Payment Success Route

Stripe redirects successful Checkout sessions to:

```text
/payment/success
```

The frontend success page repeatedly refreshes the tenant-rentals query for a limited period.

This allows time for the backend Stripe webhook to update:

- Payment status to `COMPLETED`
- Rental status to `ACTIVE`
- Property status to `RENTED`

The success page should remain open until synchronization completes or the retry period finishes.

---

## 8.3 Payment Cancellation Route

Stripe cancellation redirects to:

```text
/payment/cancel
```

Cancelling Checkout:

- Does not delete the approved rental request
- Does not complete payment
- Leaves the payment eligible to be continued
- Leaves the rental request in its approved state

The tenant can return to the rental dashboard and continue the Stripe Checkout session.

---

## 8.4 Local Stripe URLs

Backend local environment:

```env
STRIPE_SUCCESS_URL=http://localhost:3000/payment/success
STRIPE_CANCEL_URL=http://localhost:3000/payment/cancel
```

Each variable must be on a separate line.

---

## 8.5 Production Stripe URLs

Backend production environment:

```env
STRIPE_SUCCESS_URL=https://restnest-client.vercel.app/payment/success
STRIPE_CANCEL_URL=https://restnest-client.vercel.app/payment/cancel
```

The frontend route is:

```text
/payment/cancel
```

It is not:

```text
/payment-cancel
```

---

## 8.6 Stripe Webhook

### Local webhook target

```text
http://localhost:5000/api/payments/webhook
```

Run:

```bash
npm run stripe:webhook
```

Use the signing secret printed by the Stripe CLI:

```env
STRIPE_WEBHOOK_SECRET=whsec_local_cli_secret
```

### Deployed webhook target

```text
https://restnest-backend.vercel.app/api/payments/webhook
```

The deployed Stripe webhook should subscribe to:

```text
checkout.session.completed
```

The deployed backend must use the signing secret generated for the deployed Stripe Dashboard webhook endpoint:

```env
STRIPE_WEBHOOK_SECRET=whsec_deployed_endpoint_secret
```

The local Stripe CLI signing secret and deployed Stripe Dashboard signing secret are different.

---

# 9. Review Integration

## 9.1 Create Review

### Browser request

```http
POST /api/reviews
```

### Backend request

```http
POST /api/reviews
```

### Request body

```json
{
  "rentalRequestId": "rental-request-id",
  "rating": 5,
  "comment": "Optional written feedback"
}
```

Validation requirements:

- `rentalRequestId` must be present.
- `rating` must be an integer from 1 through 5.
- `comment` is optional.

A tenant may submit a review only when the rental is eligible.

After successful review submission, the frontend:

1. Updates the tenant-rentals cache.
2. Stores the returned review.
3. Marks the local rental as completed.
4. Invalidates the public property-details query.
5. Replaces the review form with the submitted review.

The backend remains responsible for preventing duplicate or unauthorized reviews.

---

# 10. Landlord Integration

Landlord endpoints require an authenticated user with the role:

```text
LANDLORD
```

## 10.1 Get Landlord Properties

### Browser request

```http
GET /api/landlord/properties
```

### Backend request

```http
GET /api/landlord/properties
```

React Query key:

```ts
["landlord", "properties"]
```

---

## 10.2 Create Property

### Browser request

```http
POST /api/landlord/properties
```

### Backend request

```http
POST /api/landlord/properties
```

The request can include:

- Title
- Description
- Location
- Optional address
- Price
- Bedrooms
- Bathrooms
- Optional area
- Category ID
- Amenities
- Image URLs

After successful creation, the frontend invalidates related property queries.

Typical invalidations include:

```ts
["landlord", "properties"]
["properties"]
```

---

## 10.3 Get One Landlord Property

### Browser request

```http
GET /api/landlord/properties/:propertyId
```

The frontend route returns the property belonging to the authenticated landlord.

A missing property or a property not owned by the authenticated landlord returns a controlled `404` response.

---

## 10.4 Update Property

### Browser request

```http
PATCH /api/landlord/properties/:propertyId
```

### Backend request

```http
PATCH /api/landlord/properties/:propertyId
```

The update may include:

- Property title
- Description
- Location
- Address
- Price
- Bedrooms
- Bathrooms
- Area
- Category
- Amenities
- Image URLs
- Availability status

Landlord-editable availability statuses:

```text
AVAILABLE
UNAVAILABLE
```

A rented property’s status is controlled by the rental lifecycle and cannot be freely changed through normal landlord availability controls.

---

## 10.5 Delete Property

### Browser request

```http
DELETE /api/landlord/properties/:propertyId
```

### Backend request

```http
DELETE /api/landlord/properties/:propertyId
```

After deletion, the frontend invalidates:

```ts
["landlord", "properties"]
["properties"]
```

The backend remains responsible for preventing deletion when rental relationships make deletion invalid.

---

## 10.6 Get Rental Requests

### Browser request

```http
GET /api/landlord/requests
```

### Backend request

```http
GET /api/landlord/requests
```

React Query key:

```ts
["landlord", "requests"]
```

---

## 10.7 Approve or Reject Rental Request

### Browser request

```http
PATCH /api/landlord/requests/:requestId
```

### Backend request

```http
PATCH /api/landlord/requests/:requestId
```

Approve body:

```json
{
  "status": "APPROVED"
}
```

Reject body:

```json
{
  "status": "REJECTED"
}
```

Allowed landlord decisions:

```text
APPROVED
REJECTED
```

After success, the frontend invalidates relevant queries:

```ts
["landlord", "requests"]
["landlord", "properties"]
["properties"]
```

Only pending rental requests display approve and reject controls.

---

# 11. Administrator Integration

Administrator endpoints require an authenticated user with the role:

```text
ADMIN
```

## 11.1 Get Users

### Browser request

```http
GET /api/admin/users
```

### Backend request

```http
GET /api/admin/users
```

React Query key:

```ts
["admin", "users"]
```

The frontend supports:

- Name search
- Email search
- Role filtering
- Status filtering
- Client-side pagination

---

## 11.2 Update User Status

### Browser request

```http
PATCH /api/admin/users/:userId
```

### Backend request

```http
PATCH /api/admin/users/:userId
```

Activate body:

```json
{
  "status": "ACTIVE"
}
```

Ban body:

```json
{
  "status": "BANNED"
}
```

Supported account statuses:

```text
ACTIVE
BANNED
```

The administrator interface prevents the signed-in administrator from changing their own account status.

The backend should also enforce authorization and account-status rules independently of the frontend.

---

## 11.3 Get All Properties

### Browser request

```http
GET /api/admin/properties
```

### Backend request

```http
GET /api/admin/properties
```

React Query key:

```ts
["admin", "properties"]
```

The response includes:

- Property information
- Category information
- Landlord information
- Landlord account status

The frontend supports:

- Property search
- Status filtering
- Category filtering
- Client-side pagination
- Public property inspection links

---

# 12. React Query Cache Strategy

RESTNEST uses stable query keys to coordinate data loading and updates.

| Data | Query key |
|---|---|
| Session | Session query key used by `use-session` |
| Public properties | `["properties", ...filters]` |
| Property details | `["properties", "details", propertyId]` |
| Tenant rentals | `["tenant", "rentals"]` |
| Landlord properties | `["landlord", "properties"]` |
| Landlord property | `["landlord", "properties", propertyId]` |
| Landlord requests | `["landlord", "requests"]` |
| Admin users | `["admin", "users"]` |
| Admin properties | `["admin", "properties"]` |

Mutations may:

- Update cached data immediately
- Apply optimistic changes
- Roll back optimistic changes after failure
- Invalidate related queries
- Refetch canonical backend data

---

## 12.1 Authentication Cache Isolation

When login succeeds, the frontend:

1. Clears the existing query cache.
2. Stores the newly authenticated session.
3. Redirects to the correct dashboard.

When logout succeeds, the frontend:

1. Clears the query cache.
2. Clears the session value.
3. Redirects to the public homepage.

This prevents:

- Tenant A’s rentals appearing for Tenant B
- Landlord data appearing for another landlord
- Administrator data remaining after logout
- Stale private data appearing during account switching

---

## 12.2 Rental-Request Eligibility

The property rental-request form:

- Enables its tenant-rentals query only for authenticated tenants
- Treats the query as immediately stale
- Refetches whenever the form mounts
- Refetches when the window regains focus
- Immediately inserts a newly created request into the cache

This ensures that the form opens or closes based on the currently authenticated tenant’s real rental records.

---

# 13. Error Handling

The frontend API layer distinguishes between:

- Network failures
- Invalid requests
- Authentication failures
- Authorization failures
- Resource-not-found responses
- Validation failures
- Rate-limit responses
- Backend server errors
- Invalid or unexpected JSON responses

Common status handling:

| Status | Frontend meaning |
|---|---|
| `400` | Invalid request or validation failure |
| `401` | Missing, invalid, or expired session |
| `403` | Authenticated user lacks permission |
| `404` | Requested resource was not found |
| `409` | Conflicting or duplicate operation |
| `429` | Too many requests |
| `500+` | Backend is temporarily unavailable |

Errors may be presented through:

- Inline form feedback
- Semantic error panels
- Retry controls
- Ark UI toast notifications
- Route-level error boundaries
- Global application error boundary
- Custom not-found page

Sensitive values, raw access tokens, private environment variables, and server stack traces must not be exposed to the browser.

---

# 14. Authentication Security

Protected backend requests are performed through:

```text
lib/api/authenticated-api-request.ts
```

The protected request process:

1. Reads the authentication token from the HTTP-only cookie.
2. Rejects the request when no token is present.
3. Adds the token as a Bearer authorization header.
4. Disables caching for authenticated backend responses.
5. Forwards the backend response safely.

Client components do not read the raw access token.

Frontend role checks improve user experience, but the backend remains responsible for authoritative authorization.

---

# 15. Frontend API Service Files

```text
lib/api/
├── admin-properties-client.ts
├── admin-users-client.ts
├── api-client.ts
├── api-route-utils.ts
├── auth-client.ts
├── authenticated-api-request.ts
├── categories.ts
├── landlord-properties-client.ts
├── landlord-requests-client.ts
├── properties.ts
├── property-details-client.ts
├── tenant-payments-client.ts
├── tenant-rentals-client.ts
└── tenant-reviews-client.ts
```

Frontend route handlers are located under:

```text
app/api/
```

---

# 16. Local Integration Testing

## Frontend

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

## Backend

Backend URL:

```text
http://localhost:5000
```

API base:

```text
http://localhost:5000/api
```

Run:

```bash
npm run dev
```

## Stripe CLI

Run:

```bash
npm run stripe:webhook
```

Webhook target:

```text
http://localhost:5000/api/payments/webhook
```

---

# 17. Manual Integration Checklist

## Authentication

- Register a tenant.
- Register a landlord.
- Confirm public admin registration is unavailable.
- Log in with tenant credentials.
- Log in with landlord credentials.
- Log in with administrator credentials.
- Verify dashboard redirection by role.
- Log out.
- Confirm protected routes redirect signed-out users.
- Switch between two tenants without refreshing.
- Confirm private cached rental data does not cross accounts.
- Confirm a banned account cannot log in.

## Public Properties

- Load available properties.
- Confirm loading skeletons appear.
- Confirm active-fetch spinner appears.
- Filter by location.
- Filter by price.
- Filter by category.
- Combine multiple filters.
- Reset filters.
- Open a valid property.
- Open an invalid property ID.
- Test an invalid property image.
- Confirm the placeholder image appears.

## Tenant

- Submit a rental request.
- Confirm the form closes immediately.
- Confirm duplicate requests are blocked.
- Log out and log in as the same tenant.
- Confirm the request form remains closed.
- Log in as another tenant.
- Confirm request eligibility uses the new tenant’s data.
- Confirm the request appears in tenant rentals.
- Confirm all rental statuses render correctly.
- Start Stripe Checkout.
- Cancel Stripe Checkout.
- Continue an incomplete Checkout session.
- Complete Stripe Checkout.
- Confirm webhook synchronization.
- Confirm payment becomes completed.
- Confirm rental becomes active.
- Confirm property becomes rented.
- Submit an eligible review.
- Confirm rental becomes completed.
- Confirm review appears publicly.
- Confirm duplicate review submission is unavailable.

## Landlord

- Create a property.
- Confirm public property data updates.
- Edit property information.
- Change property availability.
- Delete an eligible property.
- Cancel the delete confirmation.
- Approve a pending rental request.
- Reject another pending request.
- Confirm completed decisions cannot be repeated.
- Confirm rented-property restrictions.

## Administrator

- Load platform totals.
- Confirm recent users are sorted correctly.
- Confirm recent properties are sorted correctly.
- Search users by name.
- Search users by email.
- Filter users by role.
- Filter users by status.
- Test user pagination.
- Activate a banned user.
- Ban an active user.
- Confirm current-administrator protection.
- Search properties.
- Filter properties by status.
- Filter properties by category.
- Inspect landlord information.
- Open a public property-details link.

## Failure Handling

- Stop the backend.
- Confirm public API errors render correctly.
- Confirm retry controls work.
- Test invalid login credentials.
- Test unauthorized dashboard routes.
- Test invalid form values.
- Confirm toast notifications appear.
- Confirm error boundaries work.
- Confirm the custom 404 page works.

---

# 18. Production Configuration

## Frontend Vercel

```env
NEXT_PUBLIC_API_BASE_URL=https://restnest-backend.vercel.app/api
```

## Backend Vercel

```env
STRIPE_SUCCESS_URL=https://restnest-client.vercel.app/payment/success
STRIPE_CANCEL_URL=https://restnest-client.vercel.app/payment/cancel
STRIPE_WEBHOOK_SECRET=whsec_deployed_webhook_secret
```

## Stripe deployed webhook

```text
https://restnest-backend.vercel.app/api/payments/webhook
```

Required event:

```text
checkout.session.completed
```

Environment-variable changes require a new deployment or redeployment.

---

# 19. Pre-Deployment Verification

Run in the frontend project:

```bash
npm run lint
npm run build
```

Run in the backend project:

```bash
npm run build
```

Confirm:

- Frontend lint passes.
- Frontend production build passes.
- Backend TypeScript build passes.
- Frontend Vercel has the correct API base URL.
- Backend Vercel has the deployed frontend payment URLs.
- Stripe deployed webhook uses the deployed endpoint secret.
- Frontend and backend production origins are permitted.
- Authentication works after browser refresh.
- All three role accounts are available.
- Stripe is using test mode during final testing.
- No environment file is committed to Git.

---

# 20. Production Smoke Test

After frontend and backend deployment:

1. Open the deployed frontend.
2. Browse public properties.
3. Open a property-details page.
4. Log in as tenant.
5. Confirm tenant dashboard access.
6. Log out.
7. Log in as landlord.
8. Confirm landlord dashboard access.
9. Log out.
10. Log in as administrator.
11. Confirm administrator dashboard access.
12. Submit a tenant rental request.
13. Approve the request as landlord.
14. Complete Stripe test Checkout.
15. Confirm redirect to:

```text
https://restnest-client.vercel.app/payment/success
```

16. Confirm the deployed webhook returns HTTP `200`.
17. Confirm payment becomes `COMPLETED`.
18. Confirm rental becomes `ACTIVE`.
19. Confirm property becomes `RENTED`.
20. Submit a tenant review.
21. Confirm rental becomes `COMPLETED`.
22. Confirm the review appears publicly.