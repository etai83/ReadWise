import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to ReadWise
        </h1>

        <p className="mt-3 text-2xl">
          The best way to practice your reading comprehension.
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
              <h3 className="text-2xl font-bold">Go to your Dashboard &rarr;</h3>
              <p className="mt-4 text-xl">
                View your progress and practice your reading comprehension.
              </p>
            </Link>
          </SignedIn>
        </div>
      </main>
    </div>
  );
}
