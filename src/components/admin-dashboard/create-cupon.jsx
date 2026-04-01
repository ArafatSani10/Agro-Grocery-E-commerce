import { useForm } from '@tanstack/react-form';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, CloudUpload, Package, Percent, Send, Tag, Ticket, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/api'; // আপনার Axios Instance

const CreateCoupon = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]); // প্রোডাক্ট লিস্ট রাখার জন্য
    const [previewUrl, setPreviewUrl] = useState(null);
    const [logoFileState, setLogoFileState] = useState(null);
    const objectUrlRef = useRef(null);

    // ১. পেজ লোড হওয়ার সময় সব প্রোডাক্ট নিয়ে আসা
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products'); // আপনার প্রোডাক্ট এপিআই
                // আপনার এপিআই রেসপন্স অনুযায়ী res.data.data বা res.data চেক করে নিবেন
                setProducts(res.data?.data || res.data || []);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchProducts();
    }, []);

    const form = useForm({
        defaultValues: {
            title: '',
            discountPercentage: '',
            minimumAmount: '',
            productId: '', // ড্রপডাউন থেকে এই আইডি যাবে
            endTime: '',
            logoFile: null,
        },
        onSubmit: async ({ value }) => {
            if (!value.title || !value.discountPercentage) {
                toast.error('Title and Discount are required!');
                return;
            }

            const formData = new FormData();
            formData.append('title', value.title);
            formData.append('discountPercentage', value.discountPercentage);
            if (value.minimumAmount) formData.append('minimumAmount', value.minimumAmount);
            if (value.productId) formData.append('productId', value.productId);
            if (value.endTime) formData.append('endTime', value.endTime);
            if (value.logoFile) formData.append('logo', value.logoFile);

            setLoading(true);
            try {
                await api.post('/coupons', formData);
                toast.success('Coupon created successfully!');
                form.reset();
                setPreviewUrl(null);
            } catch (err) {
                toast.error(err?.response?.data?.message || 'Failed to create coupon');
            } finally {
                setLoading(false);
            }
        },
    });

    // ইমেজ প্রিভিউ লজিক
    useEffect(() => {
        if (logoFileState instanceof File) {
            const obj = URL.createObjectURL(logoFileState);
            setPreviewUrl(obj);
            return () => URL.revokeObjectURL(obj);
        }
    }, [logoFileState]);

    return (
        <div className="max-w-full mx-auto p-4">
            <Toaster position="top-center" />
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
                    <Ticket className="text-emerald-500" /> Create New Coupon
                </h1>
                <p className="text-slate-500 text-sm mt-1">Manage your discounts and product-specific offers.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                        {/* Title */}
                        <form.Field name="title" children={(field) => (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><Tag size={16}/> Coupon Title</label>
                                <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="Summer Sale" className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 transition-all"/>
                            </div>
                        )} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Discount */}
                            <form.Field name="discountPercentage" children={(field) => (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><Percent size={16}/> Discount (%)</label>
                                    <input type="number" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="15" className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 transition-all"/>
                                </div>
                            )} />
                            {/* Min Amount */}
                            <form.Field name="minimumAmount" children={(field) => (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">Min Order</label>
                                    <input type="number" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="500" className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 transition-all"/>
                                </div>
                            )} />
                        </div>

                        {/* PRODUCT DROPDOWN - আপনার রিকোয়ারমেন্ট */}
                        <form.Field name="productId" children={(field) => (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><Package size={16}/> Select Product (Target)</label>
                                <select 
                                    value={field.state.value} 
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 cursor-pointer text-slate-600 appearance-none"
                                >
                                    <option value="">All Products (Apply to Every Item)</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>
                        )} />

                        {/* End Date */}
                        <form.Field name="endTime" children={(field) => (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><Calendar size={16}/> Expiry Date</label>
                                <input type="date" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500"/>
                            </div>
                        )} />
                    </div>
                </div>

                {/* Right Side: Logo & Submit */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center shadow-sm">
                        <div className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden mb-4">
                            {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <CloudUpload className="text-slate-300" size={32} />}
                        </div>
                        <form.Field name="logoFile" children={(field) => (
                            <input type="file" onChange={(e) => {
                                const f = e.target.files[0];
                                field.handleChange(f);
                                setLogoFileState(f);
                            }} className="text-xs text-slate-500 cursor-pointer" />
                        )} />
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={18} /> Create Coupon</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCoupon;