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

          
        </div>
    );
};

export default AdminHome;