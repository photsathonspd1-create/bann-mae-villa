import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/AdminSidebar";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-200">
      {/* Responsive Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-auto lg:ml-0">
        {/* Add top padding for mobile to avoid hamburger menu overlap */}
        <div className="lg:pt-0 pt-16 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
