'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Printer,
    User,
    Phone,
    MapPin,
    Package,
    CreditCard,
    Clock,
    CheckCircle,
    Truck,
    XCircle
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
    updatedAt: string;
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/admin/orders/${id}`);
            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }
            if (!res.ok) {
                throw new Error('Order not found');
            }
            const data = await res.json();
            setOrder(data);
        } catch (error) {
            console.error('Failed to fetch order:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                fetchOrder();
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handlePrint = () => {
        window.print();
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg">Loading order details...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-red-600">Order not found</h2>
                <Button onClick={() => router.push('/admin/orders')} className="mt-4">
                    Back to Orders
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                        className="glass-card hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            Order #{order.id.slice(0, 8)}
                            <Badge className={getStatusColor(order.status)}>
                                {order.status}
                            </Badge>
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Placed on {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={order.status} onValueChange={updateStatus}>
                        <SelectTrigger className="w-40 glass-card">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handlePrint} variant="outline" className="glass-card gap-2">
                        <Printer className="w-4 h-4" />
                        Print Invoice
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Customer Info */}
                <Card className="glass-card border-0">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="w-5 h-5 text-amber-500" />
                            Customer Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-neutral-400 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Name</p>
                                <p className="font-semibold">{order.name}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-neutral-400 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Phone</p>
                                <p className="font-semibold">{order.mobile}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-neutral-400 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-neutral-500">Address</p>
                                <p className="font-semibold leading-relaxed">{order.address}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <Card className="glass-card border-0 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Package className="w-5 h-5 text-amber-500" />
                            Order Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                                    <tr>
                                        <th className="p-4 font-medium text-neutral-500">Product</th>
                                        <th className="p-4 font-medium text-neutral-500">Sizes</th>
                                        <th className="p-4 font-medium text-neutral-500 text-right">Quantity</th>
                                        <th className="p-4 font-medium text-neutral-500 text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    <tr>
                                        <td className="p-4">
                                            <div className="font-semibold">Drop Shoulder Hoodie</div>
                                            <div className="text-xs text-neutral-500 mt-1">
                                                IDs: {order.products.join(', ')}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {order.sizes.map((size) => (
                                                    <Badge key={size} variant="secondary" className="text-xs">
                                                        {size}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-semibold">{order.quantity}</td>
                                        <td className="p-4 text-right">
                                            {/* Price calculation logic based on README */}
                                            550৳ <span className="text-xs text-neutral-400">x {order.quantity}</span>
                                        </td>
                                    </tr>
                                    {/* Delivery Charge Row */}
                                    <tr className="bg-neutral-50/50 dark:bg-neutral-900/20">
                                        <td colSpan={2} className="p-4 text-right font-medium text-neutral-500">
                                            Estimated Delivery Charge
                                        </td>
                                        <td colSpan={2} className="p-4 text-right font-semibold">
                                            {order.quantity >= 3 ? (
                                                <span className="text-green-600">Free</span>
                                            ) : (
                                                <span>70৳ - 120৳</span>
                                            )}
                                        </td>
                                    </tr>
                                    {/* Total Row */}
                                    <tr className="bg-neutral-100/50 dark:bg-neutral-900/50 border-t-2 border-neutral-200 dark:border-neutral-800">
                                        <td colSpan={2} className="p-4 text-right font-bold text-lg">
                                            Estimated Total
                                        </td>
                                        <td colSpan={2} className="p-4 text-right font-bold text-lg text-amber-600">
                                            {(550 * order.quantity) + (order.quantity >= 3 ? 0 : 120)}৳
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment & Timeline */}
                <Card className="glass-card border-0">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <CreditCard className="w-5 h-5 text-amber-500" />
                            Payment Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                                Cash On Delivery
                            </p>
                            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                Payment to be collected upon delivery
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                            <h4 className="font-semibold text-sm text-neutral-500">Order Timeline</h4>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Order Placed</p>
                                        <p className="text-xs text-neutral-500">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        <Clock className="w-4 h-4 text-neutral-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Last Updated</p>
                                        <p className="text-xs text-neutral-500">
                                            {new Date(order.updatedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
