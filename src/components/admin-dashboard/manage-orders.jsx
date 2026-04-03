"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, Loader2, Package, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/api';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

// Mirror the backend transition rules — no going backwards
const ALLOWED_TRANSITIONS = {
    PENDING:   ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['SHIPPED', 'CANCELLED'],
    SHIPPED:   ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
};

const canTransition = (from, to) => ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;

const statusStyles = {
    PENDING:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
    CONFIRMED: 'bg-blue-100 text-blue-700 border border-blue-200',
    SHIPPED:   'bg-purple-100 text-purple-700 border border-purple-200',
    DELIVERED: 'bg-green-100 text-green-700 border border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border border-red-200',
};

const paymentStatusStyles = {
    PENDING:   'bg-yellow-50 text-yellow-600',
    SUCCEEDED: 'bg-green-50 text-green-600',
    FAILED:    'bg-red-50 text-red-600',
    REFUNDED:  'bg-slate-100 text-slate-500',
};

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 10;

    // detail modal
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // status update
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async (p = 1) => {
        setLoading(true);
        try {
            const res = await api.get(`/orders/admin?page=${p}&limit=${LIMIT}`);
            const data = res?.data || res || [];
            const meta = res?.meta || {};
            setOrders(Array.isArray(data) ? data : []);
            setTotalPages(meta.totalPages || 1);
            setPage(p);
        } catch {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(1); }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
            const updated = res?.data || res;
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updated } : o));
            if (selectedOrder?.id === orderId) setSelectedOrder(prev => ({ ...prev, ...updated }));
            toast.success(`Status updated to ${newStatus}`);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Update failed');
        } finally {
            setUpdatingId(null);
        }
    };

    const openDetail = (order) => {
        setSelectedOrder(order);
        setIsDetailOpen(true);
    };

    const filtered = orders.filter(o => {
        const matchSearch =
            o.invoce?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${o.firstName} ${o.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="w-full bg-white min-h-screen p-5">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Order Management</h1>
                    <p className="text-slate-400 text-sm font-medium">View and update the status of all customer orders</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* search */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by invoice, name or email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md focus:border-green-500 outline-none text-sm transition-all"
                        />
                    </div>

                    {/* status filter */}
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-green-500 transition-all"
                    >
                        <option value="ALL">All Statuses</option>
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Invoice</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Customer</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Date</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Total</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Payment</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Update Status</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-16">
                                    <Loader2 size={28} className="animate-spin text-green-500 mx-auto" />
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-16 text-slate-400 text-sm">
                                    <Package size={36} className="mx-auto mb-2 text-slate-300" />
                                    No orders found
                                </td>
                            </tr>
                        ) : filtered.map((order, idx) => (
                            <tr
                                key={order.id}
                                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                            >
                                <td className="px-4 py-3 text-xs font-bold text-green-700 font-mono">{order.invoce}</td>
                                <td className="px-4 py-3">
                                    <p className="text-sm font-semibold text-slate-700">{order.firstName} {order.lastName}</p>
                                    <p className="text-xs text-slate-400">{order.email}</p>
                                </td>
                                <td className="px-4 py-3 text-xs text-slate-500">
                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                </td>
                                <td className="px-4 py-3 text-sm font-bold text-slate-700">${Number(order.finalAmount || 0).toFixed(2)}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${paymentStatusStyles[order.payments?.[0]?.status] || 'bg-slate-100 text-slate-500'}`}>
                                        {order.payments?.[0]?.status || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[order.status] || 'bg-slate-100 text-slate-500'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {updatingId === order.id ? (
                                        <Loader2 size={16} className="animate-spin text-green-500" />
                                    ) : (
                                        <select
                                            value={order.status}
                                            onChange={e => handleStatusChange(order.id, e.target.value)}
                                            className="text-xs px-2 py-1.5 border border-slate-200 rounded-md bg-slate-50 outline-none focus:border-green-500 transition-all cursor-pointer"
                                        >
                                            {ORDER_STATUSES.map(s => (
                                                <option
                                                    key={s}
                                                    value={s}
                                                    disabled={s !== order.status && !canTransition(order.status, s)}
                                                >
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => openDetail(order)}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <Eye size={14} /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 mt-4">
                    <button
                        onClick={() => fetchOrders(page - 1)}
                        disabled={page <= 1}
                        className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => fetchOrders(page + 1)}
                        disabled={page >= totalPages}
                        className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Order Detail Modal */}
            <AnimatePresence>
                {isDetailOpen && selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Order Details</h2>
                                    <p className="text-xs text-green-600 font-mono font-bold">{selectedOrder.invoce}</p>
                                </div>
                                <button onClick={() => setIsDetailOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6 space-y-6">
                                {/* Customer Info */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Customer Information</h3>
                                    <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-xl p-4">
                                        <div>
                                            <p className="text-xs text-slate-400">Name</p>
                                            <p className="text-sm font-semibold text-slate-700">{selectedOrder.firstName} {selectedOrder.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Email</p>
                                            <p className="text-sm font-semibold text-slate-700">{selectedOrder.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Phone</p>
                                            <p className="text-sm font-semibold text-slate-700">{selectedOrder.phoneNumber || '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Address</p>
                                            <p className="text-sm font-semibold text-slate-700">{selectedOrder.streetAddress}, {selectedOrder.city}, {selectedOrder.country}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Info */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Order Summary</h3>
                                    <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-xl p-4">
                                        <div>
                                            <p className="text-xs text-slate-400">Order Status</p>
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block mt-1 ${statusStyles[selectedOrder.status] || ''}`}>
                                                {selectedOrder.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Payment Status</p>
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block mt-1 ${paymentStatusStyles[selectedOrder.payments?.[0]?.status] || 'bg-slate-100 text-slate-500'}`}>
                                                {selectedOrder.payments?.[0]?.status || 'N/A'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Payment Method</p>
                                            <p className="text-sm font-semibold text-slate-700">{selectedOrder.paymentMethod}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Shipping</p>
                                            <p className="text-sm font-semibold text-slate-700">{selectedOrder.shippingOption} (${Number(selectedOrder.shippingCost || 0).toFixed(2)})</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Total Amount</p>
                                            <p className="text-sm font-bold text-green-600">${Number(selectedOrder.finalAmount || 0).toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Date</p>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                {selectedOrder.orderItems?.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Items Ordered ({selectedOrder.orderItems.length})</h3>
                                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-200">
                                                        <th className="px-4 py-2 text-xs font-bold text-slate-500">Product</th>
                                                        <th className="px-4 py-2 text-xs font-bold text-slate-500 text-center">Qty</th>
                                                        <th className="px-4 py-2 text-xs font-bold text-slate-500 text-right">Price</th>
                                                        <th className="px-4 py-2 text-xs font-bold text-slate-500 text-right">Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedOrder.orderItems.map(item => (
                                                        <tr key={item.id} className="border-b border-slate-100 last:border-0">
                                                            <td className="px-4 py-2.5 text-sm text-slate-700">{item.title}</td>
                                                            <td className="px-4 py-2.5 text-sm text-slate-600 text-center">{item.quantity}</td>
                                                            <td className="px-4 py-2.5 text-sm text-slate-600 text-right">${Number(item.price).toFixed(2)}</td>
                                                            <td className="px-4 py-2.5 text-sm font-semibold text-slate-700 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Update Status from modal */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Update Order Status</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {ORDER_STATUSES.map(s => {
                                            const isCurrent = selectedOrder.status === s;
                                            const isAllowed = canTransition(selectedOrder.status, s);
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => isAllowed && handleStatusChange(selectedOrder.id, s)}
                                                    disabled={isCurrent || !isAllowed || updatingId === selectedOrder.id}
                                                    title={!isCurrent && !isAllowed ? `Cannot move from ${selectedOrder.status} to ${s}` : ''}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                                                        isCurrent
                                                            ? `${statusStyles[s]} opacity-80 cursor-default`
                                                            : isAllowed
                                                                ? 'bg-white border-slate-200 text-slate-600 hover:border-green-400 hover:text-green-600'
                                                                : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {updatingId === selectedOrder.id && isAllowed && !isCurrent ? (
                                                        <Loader2 size={12} className="animate-spin inline mr-1" />
                                                    ) : null}
                                                    {s}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageOrders;
