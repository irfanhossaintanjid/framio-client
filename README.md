# Framio — Creative Studio Marketplace

Framio helps creators discover, compare, and book photography studios, film stages, podcast rooms, music suites, and other creative workspaces. Studio hosts can publish and manage their listings, while signed-in creators can manage bookings and save favorite studios.

## Live site

**Live website:** `TODO: add the deployed client URL before submitting`

The repository currently has no configured production URL. Replace this placeholder with the public client URL after deployment.

## Project repositories

- **Client:** [irfanhossaintanjid/framio-client](https://github.com/irfanhossaintanjid/framio-client)
- **Express server:** [irfanhossaintanjid/framio-server](https://github.com/irfanhossaintanjid/framio-server)

## Features

- Browse and filter studio listings, view studio details, amenities, host information, ratings, and reviews.
- Create, edit, and delete studio listings; listing changes are restricted to the signed-in owner.
- Make bookings with pending, confirmed, cancelled, and completed states, with overlapping time slots protected against double booking.
- Download PDF invoices for confirmed or completed bookings.
- Save favorite studios to a MongoDB-backed wishlist.
- Use responsive layouts, light and dark themes, accessible loading states, friendly empty states, and toast notifications.

## Tech stack

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS v4 and Base UI components
- Better Auth with email/password and Google sign-in
- MongoDB for authentication, studios, bookings, and saved studios
- Express 5 API for studio mutations and booking operations
- React Toastify, Swiper, and jsPDF

## Local setup

### Requirements

- Node.js compatible with the installed Next.js version
- MongoDB database
- The Framio Express server repository
- Google OAuth credentials for Google sign-in (optional for local email/password use)

### 1. Configure the client

From the client repository root, install dependencies and create `.env.local`:

```bash
npm install
```

Set the following variables in `.env.local`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<generate-a-long-random-secret>
NEXT_PUBLIC_API_URL=http://localhost:8000
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>
```

Use the same MongoDB cluster/database for the client and server so both parts read and write the same studio and booking data. Do not commit `.env.local` or real credentials.

### 2. Configure and start the Express server

In a second terminal, clone the server repository, install its dependencies, and create its `.env` file:

```bash
git clone https://github.com/irfanhossaintanjid/framio-server.git
cd framio-server
npm install
```

Set these server variables in `framio-server/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
CLIENT_URL=http://localhost:3000
PORT=8000
```

Start the API:

```bash
node index.js
```

### 3. Start the client

In the client repository terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Keep the client and server running together. Configure the Google OAuth callback URL to match your Better Auth setup if you want to test Google sign-in.

## Examiner test account

Create a dedicated test account in the deployed application and fill in these values before submitting:

- **Email:** `TODO: add examiner test email`
- **Password:** `TODO: add examiner test password`

Do not use a personal account or publish production secrets in this README.

## Useful commands

```bash
npm run dev
npm run build
npm start
npm run lint
npx tsc --noEmit --incremental false
```
