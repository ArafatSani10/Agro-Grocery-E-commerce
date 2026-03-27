

import { useForm } from '@tanstack/react-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Layers, LayoutGrid, Send, X, PlusCircle, CloudUpload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/api';

const CreateCategory = () => {
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [iconFileState, setIconFileState] = useState(null);
    const [iconUrlState, setIconUrlState] = useState('');
    const objectUrlRef = useRef(null);

    const form = useForm({
        defaultValues: {
            name: '',
            subCategories: '',
            iconFile: null,
            iconUrl: '',
        },
        onSubmit: async ({ value }) => {
            if (!value.name || String(value.name).trim() === '') {
                toast.error('Category name is required');
                return;
            }

            let subCategoriesPayload = undefined;
            if (typeof value.subCategories === 'string' && value.subCategories.trim() !== '') {
                subCategoriesPayload = value.subCategories
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((name) => ({ name }));
            }

            const formData = new FormData();
            formData.append('name', String(value.name || ''));
            if (subCategoriesPayload !== undefined) {
                formData.append('subCategories', JSON.stringify(subCategoriesPayload));
            }
            if (value.iconFile instanceof File) {
                formData.append('icon', value.iconFile);
            } else if (typeof value.iconUrl === 'string' && value.iconUrl.trim() !== '') {
                formData.append('iconUrl', value.iconUrl.trim());
            }

            setLoading(true);
            try {
                await api.post('/categories', formData);
                toast.success('Category created successfully');
                form.reset();
                setPreviewUrl(null);
                setIconFileState(null);
                setIconUrlState('');
            } catch (err) {
                const message = err?.response?.data?.message || err?.message || 'Something went wrong';
                toast.error(message);
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (iconFileState instanceof File) {
            const obj = URL.createObjectURL(iconFileState);
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = obj;
            setPreviewUrl(obj);
            return () => URL.revokeObjectURL(obj);
        }

        if (typeof iconUrlState === 'string' && iconUrlState.trim() !== '') {
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
            setPreviewUrl(iconUrlState.trim());
        } else {
            setPreviewUrl(null);
        }
    }, [iconFileState, iconUrlState]);

    return (
        <div className="max-w-full mx-auto p-4 lg:p-4">
            <Toaster position="top-center" reverseOrder={false} />
            
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Add New Category</h1>
                    <p className="text-slate-500 text-sm mt-1">Organize your products by creating descriptive categories.</p>
                </div>
                {/* <div className="hidden md:block">
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2">
                        <PlusCircle size={14} /> Global Store
                    </div>
                </div> */}
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* Left Side: General Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-4 rounded-lg border border-slate-100  transition-all ">
                        <div className="space-y-5">
                            <form.Field
                                name="name"
                                children={(field) => (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                            <LayoutGrid size={16} className="text-slate-400" />
                                            Category Title
                                        </label>
                                        <input
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="e.g. Organic Vegetables"
                                            className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-600 placeholder:text-slate-400"
                                        />
                                    </div>
                                )}
                            />

                            <form.Field
                                name="subCategories"
                                children={(field) => (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                            <Layers size={16} className="text-slate-400" />
                                            Sub-categories
                                        </label>
                                        <textarea
                                            rows={3}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Mango, Banana, Pineapple..."
                                            className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-600 resize-none"
                                        />
                                        <p className="text-[11px] text-slate-400 italic font-light tracking-wide">Enter names separated by commas.</p>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side: Media/Upload */}
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg  border border-slate-100 shadow-sm text-center">
                        <label className="text-sm font-medium text-slate-700 block mb-4 text-left">Category Icon</label>
                        
                        <div className="relative group">
                            <div className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-colors group-hover:bg-slate-100/50 group-hover:border-emerald-200">
                                <AnimatePresence mode="wait">
                                    {previewUrl ? (
                                        <motion.div 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }} 
                                            exit={{ opacity: 0 }}
                                            className="relative w-full h-full"
                                        >
                                            <img src={previewUrl} alt="preview" className="object-cover w-full h-full" />
                                            <button 
                                                type="button" 
                                                onClick={() => { setIconFileState(null); setIconUrlState(''); setPreviewUrl(null); }}
                                                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg text-rose-500 shadow-sm border border-slate-100 hover:bg-white transition-all"
                                            >
                                                <X size={16} />
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            initial={{ y: 10, opacity: 0 }} 
                                            animate={{ y: 0, opacity: 1 }}
                                            className="flex flex-col items-center p-4"
                                        >
                                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                                                <CloudUpload size={24} />
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed px-4">Drag an image or paste a link below</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            <form.Field
                                name="iconFile"
                                children={(field) => (
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const f = e.target.files && e.target.files[0];
                                                field.handleChange(f || null);
                                                setIconFileState(f || null);
                                                if (!f) setIconUrlState('');
                                            }}
                                            className="hidden"
                                            id="icon-upload"
                                        />
                                        <label htmlFor="icon-upload" className="w-full py-2 px-4 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-200 transition-colors block">
                                            Choose Local File
                                        </label>
                                    </div>
                                )}
                            />
                            
                            <div className="flex items-center gap-2">
                                <div className="h-[1px] bg-slate-100 flex-1"></div>
                                <span className="text-[10px] text-slate-300 font-medium">OR</span>
                                <div className="h-[1px] bg-slate-100 flex-1"></div>
                            </div>

                            <form.Field
                                name="iconUrl"
                                children={(field) => (
                                    <div className="relative">
                                        <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => { field.handleChange(e.target.value); setIconUrlState(e.target.value); setIconFileState(null); }}
                                            placeholder="Image URL"
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-emerald-300 transition-all text-[13px]"
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 transition-all ${
                            loading ? 'bg-slate-100 text-slate-800' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send size={18} />
                                <span className="text-[15px] font-medium tracking-tight">Save Category</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

export default CreateCategory;