import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { MobileMenu } from "@/components/MobileMenu";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    // Demo mode bypass: Allow dashboard layout to load for unauthenticated demo users.
    // if (!session) {
    //     redirect("/");
    // }
    return (
        <div className="h-screen w-full flex bg-gray-50 overflow-hidden font-sans relative">
            <MobileMenu>
                <Sidebar inMobileMenu={true} />
            </MobileMenu>

            <div className="hidden md:block">
                <Sidebar inMobileMenu={false} />
            </div>

            <main className="flex-1 overflow-y-auto w-full h-full relative border-l border-gray-200 mt-16 md:mt-0">
                <div className="max-w-7xl mx-auto p-4 sm:p-10 lg:p-12 pb-24">
                    {children}
                </div>
            </main>
        </div>
    );
}
