
import { useForm } from '@tanstack/react-form';
import { AnimatePresence, motion } from 'framer-motion';
import {
    CloudUpload,
    DollarSign,
    FileText,
    Image as ImageIcon,
    Layers,
    PackagePlus,
    Tag,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/api';

const CreateProducts = () => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedParentId, setSelectedParentId] = useState('');
    const [selectedSubId, setSelectedSubId] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageFileState, setImageFileState] = useState(null);
    const [imageUrlState, setImageUrlState] = useState('');
    const objectUrlRef = useRef(null);

    // Fetch Categories for Dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data?.data || res.data || []);
            } catch (err) {
                console.error("Category fetch error", err);
            }
        };
        fetchCategories();
    }, []);

    const selectedParent = categories.find(c => c.id === selectedParentId);
    const subCategories = selectedParent?.children || [];

    const form = useForm({
        defaultValues: {
            title: '',
            price: '',
            description: '',
            imageFile: null,
            imageUrl: '',
        },
        onSubmit: async ({ value }) => {
            if (!value.title || !value.price || !selectedParentId) {
                toast.error('Title, Price, and Category are required');
                return;
            }

            const formData = new FormData();
            formData.append('title', value.title);
            formData.append('price', value.price);
            formData.append('description', value.description);
            // If a subcategory is selected, link product to subcategory; otherwise link to parent
            formData.append('parentId', selectedSubId || selectedParentId);
            formData.append('status', 'ACTIVE');

            if (value.imageFile instanceof File) {
                formData.append('images', value.imageFile);
            } else if (value.imageUrl.trim() !== '') {
                formData.append('imageUrl', value.imageUrl.trim());
            }

            setLoading(true);
            try {
                await api.post('/products', formData);
                toast.success('Product created successfully');
                form.reset();
                setSelectedParentId('');
                setSelectedSubId('');
                setPreviewUrl(null);
                setImageFileState(null);
                setImageUrlState('');
            } catch (err) {
                const message = err?.response?.data?.message || err?.message || 'Something went wrong';
                toast.error(message);
            } finally {
                setLoading(false);
            }
        },
    });

    // Image Preview Logic
    useEffect(() => {
        if (imageFileState instanceof File) {
            const obj = URL.createObjectURL(imageFileState);
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = obj;
            setPreviewUrl(obj);
            return () => URL.revokeObjectURL(obj);
        }
        if (imageUrlState.trim() !== '') {
            setPreviewUrl(imageUrlState.trim());
        } else {
            setPreviewUrl(null);
        }
    }, [imageFileState, imageUrlState]);

    return (
        <div className="max-w-full mx-auto p-4">
            <Toaster position="top-right" />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Add New Product</h1>
                    <p className="text-slate-500 text-sm mt-1">Fill in the details to list a new product in your store.</p>
                </div>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* Left Side: Product Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">

                        {/* Product Title */}
                        <form.Field
                            name="title"
                            children={(field) => (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Tag size={16} className="text-emerald-500" /> Product Title
                                    </label>
                                    <input
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="e.g. Fresh Organic Spinach"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                    />
                                </div>
                            )}
                        />

                        {/* Price + Category row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <form.Field
                                name="price"
                                children={(field) => (
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <DollarSign size={16} className="text-emerald-500" /> Price
                                        </label>
                                        <input
                                            type="number"
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                        />
                                    </div>
                                )}
                            />

                            {/* Parent Category */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Layers size={16} className="text-emerald-500" /> Category
                                </label>
                                <select
                                    value={selectedParentId}
                                    onChange={(e) => {
                                        setSelectedParentId(e.target.value);
                                        setSelectedSubId('');
                                    }}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sub Category — only shown when selected parent has children */}
                        {selectedParentId && subCategories.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Layers size={16} className="text-emerald-400" /> Sub Category
                                    <span className="text-xs font-normal text-slate-400">(optional)</span>
                                </label>
                                <select
                                    value={selectedSubId}
                                    onChange={(e) => setSelectedSubId(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">No sub-category (use parent)</option>
                                    {subCategories.map((sub) => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Description */}
                        <form.Field
                            name="description"
                            children={(field) => (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <FileText size={16} className="text-emerald-500" /> Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Product details..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
                                    />
                                </div>
                            )}
                        />
                    </div>
                </div>

                {/* Right Side: Image Upload & Action */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <label className="text-sm text-slate-700 block mb-4 text-left font-mono">PRODUCT IMAGE</label>

                        <div className="relative group aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden transition-all group-hover:border-emerald-300">
                            <AnimatePresence mode="wait">
                                {previewUrl ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full h-full">
                                        <img src={previewUrl} alt="preview" className="object-cover w-full h-full" />
                                        <button
                                            type="button"
                                            onClick={() => { setImageFileState(null); setImageUrlState(''); setPreviewUrl(null); }}
                                            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg text-rose-500 shadow-md hover:bg-white transition-all"
                                        >
                                            <X size={18} />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                                            <CloudUpload size={24} />
                                        </div>
                                        <p className="text-xs text-slate-500">Upload product image</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-4 space-y-3">
                            <form.Field
                                name="imageFile"
                                children={(field) => (
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                field.handleChange(file || null);
                                                setImageFileState(file || null);
                                                if (file) setImageUrlState('');
                                            }}
                                            className="hidden"
                                            id="product-image"
                                        />
                                        <label htmlFor="product-image" className="w-full py-2.5 px-4 bg-slate-100 text-slate-600 rounded-xl text-xs cursor-pointer hover:bg-slate-200 transition-colors block">
                                            BROWSE LOCAL FILE
                                        </label>
                                    </div>
                                )}
                            />

                            <div className="flex items-center gap-2 py-1">
                                <div className="h-[1px] bg-slate-100 flex-1"></div>
                                <span className="text-[10px] text-slate-300 font-bold">OR</span>
                                <div className="h-[1px] bg-slate-100 flex-1"></div>
                            </div>

                            <form.Field
                                name="imageUrl"
                                children={(field) => (
                                    <div className="relative">
                                        <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => {
                                                field.handleChange(e.target.value);
                                                setImageUrlState(e.target.value);
                                                setImageFileState(null);
                                            }}
                                            placeholder="Paste Image URL"
                                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-300 text-sm"
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
                        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all ${
                            loading ? 'bg-slate-200 text-slate-500' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                        }`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <PackagePlus size={20} />
                                <span>PUBLISH PRODUCT</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

export default CreateProducts;
