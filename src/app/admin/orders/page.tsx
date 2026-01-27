'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Search, Trash2 } from 'lucide-react';

interface Order {
    id: string;
    name: string;
    mobile: string;
    address: string;
    products: string[];
    sizes: string[];
    quantity: number;
    status: string;
    createdAt: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOrders();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchOrders = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (search) params.set('search', search);

            const res = await fetch(`/api/admin/orders?${params}`);
            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }
            const data = await res.json();
            setOrders(data.orders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchOrders();
        } catch (error) {
            console.error('Failed to update order:', error);
        }
    };

    const deleteOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return;

        try {
            await fetch(`/api/admin/orders/${orderId}`, {
                method: 'DELETE',
            });
            fetchOrders();
        } catch (error) {
            console.error('Failed to delete order:', error);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-500 hover:bg-yellow-600',
            confirmed: 'bg-blue-500 hover:bg-blue-600',
            delivered: 'bg-green-500 hover:bg-green-600',
            cancelled: 'bg-red-500 hover:bg-red-600',
        };
        return colors[status] || 'bg-gray-500';
    };

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                    Orders
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                    Manage and track all customer orders
                </p>
            </div>

            <Card className="glass-card border-0 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <Input
                            placeholder="Search by name, mobile, or order ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 glass-card border-0 h-12"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-48 glass-card border-0 h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            <Card className="glass-card border-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-neutral-200 dark:border-neutral-800">
                                <TableHead className="font-semibold">Order ID</TableHead>
                                <TableHead className="font-semibold">Customer</TableHead>
                                <TableHead className="font-semibold">Mobile</TableHead>
                                <TableHead className="font-semibold">Products</TableHead>
                                <TableHead className="font-semibold">Sizes</TableHead>
                                <TableHead className="font-semibold">Qty</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Date</TableHead>
                                <TableHead className="font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8">
                                        No orders found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        className="border-b border-neutral-100 dark:border-neutral-800/50"
                                    >
                                        <TableCell className="font-mono text-xs">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="hover:underline hover:text-amber-600 font-mono"
                                            >
                                                {order.id.slice(0, 8)}...
                                            </Link>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="hover:underline hover:text-amber-600 block py-1"
                                            >
                                                {order.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{order.mobile}</TableCell>
                                        <TableCell className="text-xs">
                                            {order.products.join(', ')}
                                        </TableCell>
                                        <TableCell>{order.sizes.join(', ')}</TableCell>
                                        <TableCell className="font-semibold">{order.quantity}</TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusColor(order.status)} text-white`}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Select
                                                    value={order.status}
                                                    onValueChange={(value) => updateStatus(order.id, value)}
                                                >
                                                    <SelectTrigger className="w-32 h-9 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                                        <SelectItem value="delivered">Delivered</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deleteOrder(order.id)}
                                                    className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
