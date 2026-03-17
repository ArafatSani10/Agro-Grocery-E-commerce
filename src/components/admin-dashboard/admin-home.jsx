import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package, 
  ArrowUpRight, 
  TrendingUp 
} from 'lucide-react';

const AdminHome = () => {
    const stats = [
        { label: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Orders', value: '45', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Customers', value: '1,205', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Low Stock Items', value: '12', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    const recentOrders = [
        { id: "#ORD-7721", customer: "Arafat Sani", product: "Organic Mango", amount: "$45.00", status: "Delivered" },
        { id: "#ORD-7722", customer: "Maruf Ahmed", product: "Fresh Honey", amount: "$32.50", status: "Pending" },
        { id: "#ORD-7723", customer: "Sani Rahman", product: "Green Tea", amount: "$18.00", status: "Processing" },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-800">Store Overview</h1>
                <p className="text-sm text-slate-500 font-bold mt-1">Checking your grocery store's performance today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-slate-200 rounded-lg p-6 hover:border-emerald-500/50 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 ${stat.bg} rounded-lg ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="flex items-center text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                +12% <ArrowUpRight size={12} className="ml-1" />
                            </span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 tracking-tight">{stat.label}</p>
                        <h3 className="text-2xl font-black text-slate-800 mt-1">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Recent Orders</h3>
                        <button className="text-[12px] font-bold text-blue-600 hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentOrders.map((order, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-800">{order.id}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-600">{order.customer}</td>
                                        <td className="px-6 py-4 text-xs font-black text-slate-800">{order.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase border ${
                                                order.status === 'Delivered' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                order.status === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                                'bg-blue-50 border-blue-100 text-blue-600'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Analytics (Placeholders) */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp size={18} className="text-emerald-600" />
                        <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Performance</h3>
                    </div>
                    <div className="space-y-6">
                        {[
                            { label: 'Store Visits', progress: '75%', color: 'bg-blue-500' },
                            { label: 'Conversion Rate', progress: '42%', color: 'bg-emerald-500' },
                            { label: 'Bounce Rate', progress: '15%', color: 'bg-rose-500' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-[11px] font-black mb-2">
                                    <span className="text-slate-500 uppercase">{item.label}</span>
                                    <span className="text-slate-800">{item.progress}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color}`} style={{ width: item.progress }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;