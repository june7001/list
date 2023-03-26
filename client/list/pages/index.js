import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>My App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to My App!
        </h1>

        <p className="text-xl mb-8">
          An application to manage your lists and friends.
        </p>

        <div className="flex justify-center space-x-4">
          <Link href="/register" passHref>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Register
            </button>
          </Link>
          <Link href="/login" passHref>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
