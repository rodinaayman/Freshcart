"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getUserOrders } from "@/services/orders.service";
import { formatePrice } from "@/lib/formatter";
import { Loader2 } from "lucide-react";

import {
    FaBox, FaShoppingBag, FaCalendarAlt, FaMapMarkerAlt,
    FaMoneyBill, FaChevronDown, FaReceipt, FaHashtag, FaClock, FaPhone
} from "react-icons/fa";

interface OrderItem {
    product: { title: string; imageCover: string; };
    count: number;
    price: number;
}

interface ShippingAddress {
    city: string;
    details: string;
    phone: string;
}

interface Order {
    _id: string;
    id?: number;
    status: string;
    createdAt: string;
    totalOrderPrice: number;
    shippingAddress: ShippingAddress;
    paymentMethodType: string;
    cartItems: OrderItem[];
}

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        const fetchOrders = async () => {
            const userId = (session?.user as any)?.id;

            if (session?.accessToken && userId) {
                try {
                    const res = await getUserOrders(userId, session.accessToken);
                    if (res && Array.isArray(res)) {
                        setOrders(res);
                    } else if (res && res.data) {
                        setOrders(res.data);
                    }
                } catch (error: any) {
                    toast.error(error.message || "Failed to fetch orders");
                } finally {
                    setLoading(false);
                }
            } else if (status === "authenticated") {
                setLoading(false);
            }
        };

        if (status === "authenticated") fetchOrders();
    }, [status, session, router]);

    const toggleExpand = (id: string) => {
        setExpandedOrder(prev => (prev === id ? null : id));
    };

    if (loading || status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">

            <div className="mb-8">
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-primary-600 transition">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">My Orders</span>
                </nav>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#25c95e] flex items-center justify-center shadow-lg">
                            <FaBox className="text-2xl text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
                            <p className="text-gray-500 text-sm mt-0.5">Track and manage your {orders.length} orders</p>
                        </div>
                    </div>
                    <Link href="/" className="self-start sm:self-auto text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-primary-50 transition-all text-sm">
                        <FaShoppingBag className="text-xs" /> Continue Shopping
                    </Link>
                </div>
            </div>

            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                        <FaBox className="mx-auto w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-6">Looks like you haven't placed any orders.</p>
                        <Link href="/products" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-[#25c95e] text-white hover:bg-[#1ea04d] h-10 px-8 py-2">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    orders.map((order) => {
                        const isExpanded = expandedOrder === order._id;

                        return (
                            <div
                                key={order._id}
                                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden 
                  ${isExpanded ? 'border-[#25c95e] shadow-lg shadow-green-100/50' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'}`}
                            >
                                <div className="p-5 sm:p-6">
                                    <div className="flex gap-5">
                                        <div className="relative shrink-0">
                                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-2.5 overflow-hidden">
                                                {order.cartItems && order.cartItems.length > 0 && (
                                                    <img
                                                        alt=""
                                                        className="w-full h-full object-contain"
                                                        src={order.cartItems[0].product.imageCover}
                                                    />
                                                )}
                                            </div>
                                            {order.cartItems && order.cartItems.length > 1 && (
                                                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                                                    +{order.cartItems.length - 1}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div>
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 rounded-lg mb-2">
                                                        <FaClock className="text-xs text-amber-600" />
                                                        <span className="text-xs font-semibold text-amber-600">{order.status || 'Processing'}</span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                                        <FaHashtag className="text-xs text-gray-400" /> {order.id || order._id}
                                                    </h3>
                                                </div>
                                                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100">
                                                    <FaMoneyBill className="text-gray-600" />
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                                                <span className="flex items-center gap-1.5">
                                                    <FaCalendarAlt className="text-xs text-gray-400" />
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span className="flex items-center gap-1.5">
                                                    <FaBox className="text-xs text-gray-400" />
                                                    {order.cartItems?.length || 0} items
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span className="flex items-center gap-1.5">
                                                    <FaMapMarkerAlt className="text-xs text-gray-400" />
                                                    {order.shippingAddress?.city}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <span className="text-2xl font-bold text-gray-900">{formatePrice(order.totalOrderPrice)}</span>
                                                    <span className="text-sm font-medium text-gray-400 ml-1">EGP</span>
                                                </div>
                                                <button
                                                    onClick={() => toggleExpand(order._id)}
                                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all 
                            ${isExpanded ? 'bg-[#25c95e] text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                                >
                                                    {isExpanded ? "Hide" : "Details"}
                                                    <FaChevronDown className={`text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50/50">
                                        <div className="p-5 sm:p-6">
                                            <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-4">
                                                <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                                                    <FaReceipt className="text-xs text-green-600" />
                                                </div>
                                                Order Items
                                            </h4>
                                            <div className="space-y-3">
                                                {order.cartItems && order.cartItems.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
                                                        <div className="w-16 h-16 rounded-xl bg-gray-50 p-2 shrink-0">
                                                            <img alt={item.product.title} className="w-full h-full object-contain" src={item.product.imageCover} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-900 truncate">{item.product.title}</p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                <span className="font-medium text-gray-700">{item.count}</span> × {formatePrice(item.price)} EGP
                                                            </p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-lg font-bold text-gray-900">{formatePrice(item.count * item.price)}</p>
                                                            <p className="text-xs text-gray-400">EGP</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 grid sm:grid-cols-2 gap-4">
                                            <div className="p-4 bg-white rounded-xl border border-gray-100">
                                                <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-3">
                                                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                                                        <FaMapMarkerAlt className="text-xs text-blue-600" />
                                                    </div>
                                                    Delivery Address
                                                </h4>
                                                <div className="space-y-2">
                                                    <p className="font-medium text-gray-900">{order.shippingAddress?.city}</p>
                                                    <p className="text-sm text-gray-600 leading-relaxed">{order.shippingAddress?.details}</p>
                                                    <p className="text-sm text-gray-600 flex items-center gap-2 pt-1">
                                                        <FaPhone className="text-xs text-gray-400" /> {order.shippingAddress?.phone}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-xl bg-amber-100 border border-amber-200">
                                                <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-3">
                                                    <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center">
                                                        <FaClock className="text-xs text-white" />
                                                    </div>
                                                    Order Summary
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between text-gray-600">
                                                        <span>Subtotal</span>
                                                        <span className="font-medium">{formatePrice(order.totalOrderPrice)} EGP</span>
                                                    </div>
                                                    <div className="flex justify-between text-gray-600">
                                                        <span>Shipping</span>
                                                        <span className="font-medium">Free</span>
                                                    </div>
                                                    <hr className="border-gray-200/50 my-2" />
                                                    <div className="flex justify-between pt-1">
                                                        <span className="font-semibold text-gray-900">Total</span>
                                                        <span className="font-bold text-lg text-gray-900">{formatePrice(order.totalOrderPrice)} EGP</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}