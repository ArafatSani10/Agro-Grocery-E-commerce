"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, Loader2, Search, Trash2, Ticket, Percent, Calendar, UploadCloud, ImageIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/api';

const ManageCoupon = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [newLogoFile, setNewLogoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const fetchCoupons = async () => {
        try {
            const res = await api.get('/coupons/admin');
            const finalData = res?.data?.data || res?.data || [];
            setCoupons(Array.isArray(finalData) ? finalData : []);
        } catch (err) {
            toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCoupons(); }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewLogoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This will also reset product discounts.")) return;
        try {
            await api.delete(`/coupons/${id}`);
            setCoupons(prev => prev.filter(c => c.id !== id));
            toast.success("Coupon removed");
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);

        try {
            // ফাইল আপলোডের জন্য FormData ব্যবহার করা হয়েছে
            const formData = new FormData();
            formData.append('title', selectedCoupon.title);
            formData.append('discountPercentage', selectedCoupon.discountPercentage);
            formData.append('minimumAmount', selectedCoupon.minimumAmount || '');
            formData.append('endTime', selectedCoupon.endTime || '');
            // ব্যাকএন্ড লজিক অনুযায়ী ফিল্ডগুলো সেট করা হলো
            formData.append('productType', selectedCoupon.productType || '');
            formData.append('productId', selectedCoupon.productId || '');

            if (newLogoFile) {
                formData.append('logo', newLogoFile);
            }

            const res = await api.put(`/coupons/${selectedCoupon.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const updatedData = res.data?.data || res.data;
            setCoupons(prev => prev.map(c => c.id === selectedCoupon.id ? updatedData : c));
            
            toast.success("Coupon updated successfully!");
            setIsEditModalOpen(false);
            setNewLogoFile(null);
            setPreviewUrl(null);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Update failed");
        } finally {
            setUpdateLoading(false);
        }
    };

    const filtered = coupons.filter(c => 
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.couponCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full bg-white min-h-screen p-5">
            <Toaster position="top-right" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Coupon Management</h1>
                    <p className="text-slate-400 text-sm font-medium">Update banner, discount rates and expiry dates</p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search coupons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase">Campaign</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase">Offer</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase">Min. Spend</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {loading ? (
                            <tr><td colSpan="4" className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={30} /></td></tr>
                        ) : filtered.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-slate-50/50 group transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-md border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                                            {coupon.logo ? <img src={coupon.logo} className="w-full h-full object-contain p-1" /> : <Ticket size={18} className="text-slate-300" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-700">{coupon.title}</div>
                                            <div className="text-[10px] inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold border border-slate-200 mt-1 uppercase tracking-tight">{coupon.couponCode}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-emerald-600 font-bold flex items-center gap-1"><Percent size={14}/> {coupon.discountPercentage}% OFF</span>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-600">
                                    {coupon.minimumAmount ? `$${coupon.minimumAmount}` : 'No limit'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { 
                                            setSelectedCoupon({...coupon, endTime: coupon.endTime ? new Date(coupon.endTime).toISOString().slice(0, 16) : ''});
                                            setIsEditModalOpen(true);
                                        }} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(coupon.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-xl rounded-lg shadow-lg relative z-10 border border-slate-200 overflow-hidden">
                            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg"><Edit2 size={18} className="text-blue-600" /> Update Campaign</h3>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleUpdate} className="p-8">
                                {/* File Upload Area */}
                                <div className="mb-8">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase mb-2 block ml-1">Banner / Logo Image</label>
                                    <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 hover:bg-slate-100/50 transition-colors">
                                        <div className="w-16 h-16 rounded-md bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                                            {previewUrl || selectedCoupon?.logo ? (
                                                <img src={previewUrl || selectedCoupon.logo} className="w-full h-full object-contain" />
                                            ) : <ImageIcon className="text-slate-200" size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-md text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                                                <UploadCloud size={14} /> Replace Image
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                            </label>
                                            <p className="text-[10px] text-slate-400 mt-2 ml-1">Recommended: Square PNG or JPG</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1.5 col-span-2 md:col-span-1">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Title</label>
                                        <input type="text" value={selectedCoupon.title} onChange={e => setSelectedCoupon({...selectedCoupon, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all" />
                                    </div>
                                    <div className="space-y-1.5 col-span-2 md:col-span-1">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-normal italic">Code (Fixed)</label>
                                        <input type="text" value={selectedCoupon.couponCode} className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-sm text-slate-400 cursor-not-allowed" disabled />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Discount %</label>
                                        <input type="number" value={selectedCoupon.discountPercentage} onChange={e => setSelectedCoupon({...selectedCoupon, discountPercentage: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Min Amount</label>
                                        <input type="number" value={selectedCoupon.minimumAmount || ''} onChange={e => setSelectedCoupon({...selectedCoupon, minimumAmount: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all" />
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Expiry Date</label>
                                        <input type="datetime-local" value={selectedCoupon.endTime || ''} onChange={e => setSelectedCoupon({...selectedCoupon, endTime: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all" />
                                    </div>
                                </div>

                                <div className="pt-8 flex gap-4">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-slate-50 text-slate-500 font-bold text-xs uppercase rounded-lg hover:bg-slate-100 transition-all border border-slate-200">Cancel</button>
                                    <button type="submit" disabled={updateLoading} className="flex-[2] py-3 bg-blue-600 text-white font-bold text-xs uppercase rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2">
                                        {updateLoading ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageCoupon;