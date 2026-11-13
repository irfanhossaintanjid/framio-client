# Framio — Creative Studio Marketplace

**Discover. Create. Collaborate.**

Framio is a creative studio marketplace that connects creators with professional spaces for their next project. Filmmakers, photographers, podcasters, musicians, and other creators can discover and book studios, while hosts can publish and manage their creative spaces.

Whether it is a photography studio, film stage, podcast lounge, music suite, or creative workshop, Framio makes finding and managing creative spaces simple and convenient.

## Live Demo & Repositories

| Resource | Link |
|---|---|
| **Live Application** | [Framio](https://framio-client.vercel.app) |
| **Client Repository** | [framio-client](https://github.com/irfanhossaintanjid/framio-client) |
| **Server Repository** | [framio-server](https://github.com/irfanhossaintanjid/framio-server) |
| **Express API** | [Framio API](https://framio-server.vercel.app) |

## Key Features

- **Studio Discovery:** Browse and filter photography studios, film stages, podcast lounges, music suites, and creative workshops.
- **Detailed Studio Profiles:** Explore studio images, specifications, amenities, host information, ratings, and reviews.
- **Studio Management:** Create, update, and delete studio listings with server-side ownership verification.
- **Booking Management:** Create reservations, manage booking requests, and track booking statuses through Pending, Confirmed, Cancelled, and Completed.
- **Booking Availability:** Prevent overlapping reservations through server-side availability validation and unique booking-slot records in MongoDB.
- **PDF Booking Invoices:** Generate and download PDF invoices for confirmed or completed reservations.
- **Saved Studios:** Save favorite studios to a personal wishlist for easy access.
- **Authentication & Security:** Support email/password authentication and Google sign-in with secure HTTPOnly session cookies.
- **Responsive Interface:** Enjoy a consistent experience across desktop, tablet, and mobile devices.
- **Modern User Experience:** Includes light and dark themes, loading skeletons, empty states, and interactive toast notifications.

## Technology Stack

| Category | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling & UI** | Tailwind CSS v4, Base UI, Lucide Icons |
| **Animations & Slider** | Swiper |
| **Authentication** | Better Auth, Google OAuth, HTTPOnly Cookies |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB |
| **PDF Generation** | jsPDF |
| **Notifications** | React Toastify |
| **Deployment** | Vercel |

## Application Routes

| Route | Description | Access |
|---|---|---|
| `/` | Homepage with featured studios, categories, and platform overview | Public |
| `/studios` | Explore, filter, and sort studio listings | Public |
| `/studios/[id]` | View studio details, gallery, host information, and reviews | Public |
| `/login` | User authentication | Public |
| `/register` | Create a new account | Public |
| `/add-studio` | Publish a new studio listing | Authenticated |
| `/my-listings` | Manage personal studio listings | Authenticated |
| `/studios/edit/[id]` | Update an owned studio listing | Owner only |
| `/my-bookings` | Manage reservations and download invoices | Authenticated |
| `/saved-studios` | View saved favorite studios | Authenticated |

## Project Architecture

Framio uses a separate Next.js client application and Express.js API, sharing MongoDB as the primary database.

**Client Application**
- Built with Next.js App Router, React, and TypeScript.
- Uses Better Auth for authentication and session management.
- Next.js Route Handlers manage same-origin authentication, booking proxies, and studio/wishlist data access.
- Communicates with the Express API for studio mutations and booking operations.

**Server Application**
- Built with Express.js 5.
- Handles studio management and booking operations.
- Performs server-side ownership and authorization checks.
- Uses MongoDB for persistent application data.
- Validates booking availability to prevent overlapping reservations.

## Getting Started

Follow these instructions to run Framio locally.

### Prerequisites

- Node.js and npm compatible with Next.js 16.
- MongoDB database (MongoDB Atlas recommended).
- Google OAuth credentials for Google sign-in.
- Git.

### 1. Clone the Repositories

Clone the client application:

```bash
git clone https://github.com/irfanhossaintanjid/framio-client.git
cd framio-client
npm install
```

Clone the server application in a separate terminal:

```bash
git clone https://github.com/irfanhossaintanjid/framio-server.git
cd framio-server
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the **client root directory**:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_long_random_secret
NEXT_PUBLIC_API_URL=http://localhost:8000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

Create a `.env` file in the **server root directory**:

```env
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
PORT=8000
```

Use the same MongoDB database for both applications. Keep all credentials private and never commit environment files to GitHub.

### 3. Start the Express API

From the server directory:

```bash
node index.js
```

The API will run at:

```text
http://localhost:8000
```

### 4. Start the Next.js Client

From the client directory:

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

To test Google sign-in locally, configure the appropriate Google OAuth credentials and authorize the Better Auth callback URL.

**Database Note:** Booking operations use MongoDB transactions. Use a MongoDB deployment that supports transactions, such as MongoDB Atlas or a properly configured replica set.

## Deployment

Framio uses two separate Vercel deployments:

- **Client:** `framio-client.vercel.app`
- **Server:** `framio-server.vercel.app`

Configure the following environment variables in the respective Vercel projects.

**Client Environment Variables**

```env
BETTER_AUTH_URL=https://framio-client.vercel.app
NEXT_PUBLIC_API_URL=https://framio-server.vercel.app
MONGODB_URI=your_production_mongodb_connection_string
BETTER_AUTH_SECRET=your_production_random_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

**Server Environment Variables**

```env
CLIENT_URL=https://framio-client.vercel.app
MONGODB_URI=your_production_mongodb_connection_string
```

**Google OAuth Configuration**

Add the following authorized redirect URI to your Google OAuth client:

```text
https://framio-client.vercel.app/api/auth/callback/google
```

After configuring the environment variables, redeploy both applications.

## Available Scripts

### Client

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production application |
| `npm start` | Start the production server |
| `npm run lint` | Run the configured lint checks |

### TypeScript Check

```bash
npx tsc --noEmit --incremental false
```

## Demo Account

Create a dedicated account on the live application for evaluation purposes.

| Credential | Value |
|---|---|
| **Email** | `YOUR_EXAMINER_TEST_EMAIL` |
| **Password** | `YOUR_EXAMINER_TEST_PASSWORD` |

Replace these placeholders with dedicated test account credentials before submitting the project. Do not use personal account credentials.

---

**Built with Next.js, Express.js, MongoDB, and TypeScript.**

*Framio — A space for every creative idea.*
