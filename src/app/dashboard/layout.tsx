import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    return (
        <div className="h-screen w-full flex bg-gray-50 overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 overflow-y-auto w-full h-full relative border-l border-gray-200">
                <div className="max-w-7xl mx-auto p-6 sm:p-10 lg:p-12 pb-24">
                    {children}
                </div>
            </main>
        </div>
    );
}
