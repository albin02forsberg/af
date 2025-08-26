This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Firebase Firestore

This project includes Firebase client initialization and Firestore usage.

1) Create a Firebase project and a Web app in Firebase Console.
2) Copy the Web SDK config and set these variables in a new `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
# Optional
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

3) Start the app. For server access, API routes use the Admin SDK in `src/lib/firebase-admin.ts`. Optionally, the client SDK `src/lib/firebase.ts` is available for UI-only features (but this project reads data via API routes).

Example: visit `/firestore-example` to fetch the last 10 documents from the `examples` collection via the API route at `/api/examples`. Ensure your Firestore has a collection named `examples` and documents with a `createdAt` field for ordering, or adjust the query in `src/app/api/examples/route.ts`.

Server environment (Admin SDK) variables in `.env.local`:

```
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=... # escape newlines as \n
```

The endpoint uses those credentials if present, otherwise falls back to application default credentials.
