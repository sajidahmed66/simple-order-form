'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, LogOut, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === '/admin/login') {
        return children;
    }

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/orders', label: 'Orders', icon: Package },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-amber-50/30 dark:from-neutral-950 dark:via-stone-950 dark:to-zinc-950">
            <aside className="w-64 glass-card border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Crown className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                            Admin Panel
                        </h2>
                    </div>
                </div>
                <nav className="flex-1 space-y-2 p-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${pathname === item.href
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20'
                                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full glass-card border-0 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    );
}
