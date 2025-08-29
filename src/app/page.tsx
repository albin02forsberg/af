import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Dashboard from "@/components/dashboard/dashboard";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="min-h-[calc(100vh-0px)] w-full">
      {user ? (
        <main className="w-full h-full px-2 sm:px-6 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {user.firstName}!</h1>
            <p className="text-muted-foreground mt-1">Here’s what’s happening with your org.</p>
          </div>
          <Dashboard />
        </main>
      ) : (
        <main className="flex min-h-[calc(100vh-0px)] items-center justify-center px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              A clean, modern starter
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base sm:text-lg">
              Next.js + shadcn UI with Clerk authentication. Create an account or sign in to access the app.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/sign-up">Create account</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
