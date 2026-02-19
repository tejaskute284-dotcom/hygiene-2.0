"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground transition-all duration-500 font-sans relative">
            {/* Global Background Effects */}
            <div className="aurora-bg" />
            <div className="aurora-orb w-[800px] h-[800px] bg-secondary/10 top-[-200px] left-[-200px] opacity-40" />
            <div className="aurora-orb w-[600px] h-[600px] bg-primary/10 bottom-[-100px] right-[-100px] animation-delay-2000 opacity-40" />

            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
                <Header />

                <main className="flex-1 overflow-y-auto px-12 pb-12 transition-all duration-500">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
