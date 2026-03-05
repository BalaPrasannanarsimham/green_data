import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/LoginButton";
import { Leaf } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 selection:bg-green-100 selection:text-green-900">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-green-100 shadow-xl shadow-green-100/50">
          <Leaf className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 mb-4">
          Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700">Leaf</span>
        </h1>

        <p className="mt-4 text-xl sm:text-2xl font-medium text-gray-600 max-w-2xl mb-2">
          Streamline your inbox and contribute to a greener planet.
        </p>

        <p className="mt-2 text-lg text-gray-500 max-w-xl mb-10">
          Data Leaf helps you declutter your Gmail, freeing up digital space and reducing your carbon footprint.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <LoginButton />
        </div>
      </main>

      <footer className="w-full h-24 border-t border-gray-200 flex items-center justify-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Data Leaf. All rights reserved.
      </footer>
    </div>
  );
}
