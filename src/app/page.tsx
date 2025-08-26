import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { json } from "stream/consumers";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {user ? (
          <>
            <h1 className="text-2xl font-bold">Welcome back, {user.firstName}!</h1>
          </>
        ) : (
          <h1 className="text-2xl font-bold">Welcome to our website!</h1>
        )}
      </main>

    </div>
  );
}
