'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const router = useRouter();
    const abortRef = useRef<AbortController | null>(null);

    const fetchOrders = useCallback(async () => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (search) params.set('search', search);
            params.set('page', String(page));
            params.set('limit', String(limit));

            const res = await fetch(`/api/admin/orders?${params}`, {
                signal: controller.signal,
            });

            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }

            if (!res.ok) {
                throw new Error(`Failed to fetch orders (${res.status})`);
            }

            const data = await res.json();
            setOrders(data.orders);
            setPagination(data.pagination);
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') return;
            setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, search, page, limit, router]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [statusFilter, search]);

    // Debounced fetch
    useEffect(() => {
        const timer = setTimeout(fetchOrders, search ? 400 : 0);
        return () => clearTimeout(timer);
    }, [fetchOrders]);

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) {
                setError(`Failed to update order status (${res.status})`);
                return;
            }
            fetchOrders();
        } catch {
            setError('Failed to update order status');
        }
    };

    const deleteOrder = async (orderId: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                setError(`Failed to delete order (${res.status})`);
                return;
            }
            fetchOrders();
        } catch {
            setError('Failed to delete order');
        } finally {
            setDeleteTarget(null);
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
                    {pagination && (
                        <span className="ml-2 text-sm">
                            ({pagination.total} total)
                        </span>
                    )}
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

            {error && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-bold">
                        &times;
                    </button>
                </div>
            )}

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
                                                    onClick={() => setDeleteTarget(order.id)}
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

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                            <span>
                                Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                            </span>
                            <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
                                <SelectTrigger className="w-20 h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-xs">per page</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400 min-w-[80px] text-center">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={page >= pagination.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Delete confirmation dialog */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete order?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. The order will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deleteTarget && deleteOrder(deleteTarget)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
