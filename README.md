# GearGrid — Equipment Rental Platform (Client)

## Project Purpose
GearGrid is a transparent and secure full-stack Equipment Rental Platform where equipment owners list items for rent, customers search, save favorites, book, and pay online through Stripe Checkout, and administrators monitor users, equipment approvals, rentals, and analytics.

## Live URL
- Live Client URL: https://geargrid-client-ochre.vercel.app
- Live Server URL: https://geargrid-server.vercel.app

## Key Features
- **Authentication & RBAC:** BetterAuth with `@better-auth/mongo-adapter`, email/password registration with password strength validation, Google social login (defaults to `Customer`), JWT session sync, and role-based route protection (`Customer`, `Owner`, `Admin`).
- **Home Page:** Framer Motion animated Banner, Featured Equipment (6 approved items via MongoDB `.limit(6)`), Popular Categories (6 categories), Why Choose Us, Customer Reviews (4 reviews), How It Works, and Trusted Equipment Owners.
- **All Equipment Page:** Responsive 3-column card grid with server-side search (name, location, category), filtering (category, rental type, price range, availability), and sorting (price low-to-high, price high-to-low, recently added).
- **Equipment Details & Stripe Checkout:** Private route showing full specifications, owner info, terms, Favorites toggle, and Booking Modal redirecting to Stripe Checkout with automated payment verification and transaction recording.
- **Role-Based Dashboards:**
  - **Customer:** Overview, My Rentals, Favorites, Profile
  - **Owner:** Business Analytics with Recharts, Add Equipment (with imgbb upload), My Equipment, My Equipment Rental, My Profile
  - **Admin:** Platform Analytics with Recharts, All Users (role management & user management), All Equipment (Approve, Reject, Update, Delete), All Rentals, My Profile
- **Custom States:** Dedicated Loading, Error, and 404 Not Found pages.
- **Pagination:** Server-backed pagination on the All Equipment page and Booking History pages (My Rentals, My Equipment Rental, All Rentals).
- **Dark / Light Theme Toggle:** Persistent Dark Mode and Light Mode switcher stored in `localStorage`, available in both Navbar and Dashboard headers.

## NPM Packages Used
- `next`, `react`, `react-dom` — Next.js App Router framework
- `tailwindcss`, `daisyui` — Styling and responsive UI components
- `better-auth`, `@better-auth/mongo-adapter`, `mongodb` — Authentication and MongoDB session adapter
- `jsonwebtoken` — JWT issuance for Express API authorization
- `framer-motion` — Section animations
- `recharts` — Admin and Owner analytics charts
- `lucide-react` — Icons
- `react-hot-toast`, `sweetalert2` — Notifications and confirmation dialogs

## Environment Variables
Create `.env.local` based on `.env.example` and fill in your MongoDB Atlas URI, Google OAuth credentials, imgbb API key, and server URL.

## Run Locally
```bash
npm install
npm run dev
```
