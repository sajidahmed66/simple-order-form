'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Package,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    Calendar,
} from 'lucide-react';

interface Stats {
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    todayOrders: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: Package,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        },
        {
            title: 'Pending',
            value: stats?.pendingOrders || 0,
            icon: Clock,
            color: 'from-yellow-500 to-amber-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
        },
        {
            title: 'Confirmed',
            value: stats?.confirmedOrders || 0,
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50 dark:bg-green-950/30',
        },
        {
            title: 'Delivered',
            value: stats?.deliveredOrders || 0,
            icon: TrendingUp,
            color: 'from-emerald-500 to-teal-500',
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        },
        {
            title: 'Cancelled',
            value: stats?.cancelledOrders || 0,
            icon: XCircle,
            color: 'from-red-500 to-rose-500',
            bgColor: 'bg-red-50 dark:bg-red-950/30',
        },
        {
            title: 'Today',
            value: stats?.todayOrders || 0,
            icon: Calendar,
            color: 'from-purple-500 to-violet-500',
            bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                    Dashboard
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                    Overview of your order statistics
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="glass-card border-0 overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                {stat.title}
                            </CardTitle>
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.color} shadow-lg`}
                            >
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-neutral-900 dark:text-white">
                                {stat.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
