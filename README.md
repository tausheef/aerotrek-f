# AeroTrek Frontend

AeroTrek is a React + TypeScript web application for international shipment management and tracking. It includes a public landing page, user authentication, KYC verification, shipment booking/tracking, wallet management, and an admin dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3.4 |
| Routing | React Router 6 |
| State | Zustand 4 (auth) |
| Server State | TanStack React Query 5 |
| Forms | React Hook Form 7 + Zod |
| HTTP | Axios with JWT interceptors |
| Icons | Lucide React |

## Project Structure

```
src/
├── api/            # Axios instance + endpoint wrappers (auth, shipments, user, cms)
├── components/
│   ├── landing/    # Public homepage sections (Hero, Navbar, Footer, FAQ, etc.)
│   ├── dashboard/  # Dashboard layout wrapper
│   └── shared/     # Reusable UI (PageLoader, ToastContainer)
├── pages/
│   ├── dashboard/  # User pages (MyShipments, BookShipment, Track, Wallet, Profile, KYC, Addresses)
│   └── admin/      # Admin pages (Dashboard, KYC Management, CMS Manager, All Shipments)
├── router/         # Route tree with ProtectedRoute, AdminRoute, GuestRoute guards
├── store/          # Zustand stores (authStore, uiStore)
├── types/          # TypeScript interfaces (User, Shipment, KYC, Wallet, Blog, etc.)
├── hooks/          # Custom React hooks
└── utils/          # Utility fn
```

## Getting Started

### Prerequisites

- Node.js 18+
- A running backend API (see `.env` setup below)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://your-backend-url/api/v1
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Features

- **Public** — Landing page, blog, public shipment tracking
- **Auth** — Registration, login, JWT-based session persistence
- **KYC** — Identity verification flow for individuals and companies
- **Shipments** — Book, track, and manage international shipments
- **Wallet** — Balance management and transaction history
- **Address Book** — Saved sender/recipient addresses
- **Admin** — KYC approval, shipment oversight, CMS content manager

## Route Guards

| Guard | Description |
|---|---|
| `ProtectedRoute` | Requires authenticated user |
| `AdminRoute` | Requires admin role |
| `GuestRoute` | Redirects authenticated users away (login/register) |

## Design Tokens

The Tailwind config defines a custom brand palette:

| Token | Value | Usage |
|---|---|---|
| `sky` | `#00BFFF` | Primary accent |
| `navy` | `#0D0D0D` | Dark backgrounds |
| `cream` | `#F0EDE8` | Light surfaces |

Custom animations: `fade-up`, `fade-in`, `marquee`.  
Custom shadows: `sky-glow`, `dark-card`.
