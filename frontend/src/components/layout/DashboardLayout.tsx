"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] font-[family-name:var(--font-sans)] transition-colors duration-500">
            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Header />

                <main className="flex-1 overflow-y-auto p-8 relative z-0">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
