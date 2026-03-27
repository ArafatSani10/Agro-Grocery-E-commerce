import { useForm } from '@tanstack/react-form';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Layers, LayoutGrid, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/api';

const CreateCategory = () => {
    const API_URL = import.meta.env.VITE_API_URL;

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
            // Basic client-side validation
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
            } catch (err) {
                console.error('Submission Error:', err);
                const message = err?.response?.data?.message || err?.message || 'Something went wrong';
                toast.error(message);
            } finally {
                setLoading(false);
            }
        },
    });

    // manage preview URL and revoke object URLs when necessary
    useEffect(() => {
        // if iconFileState is a File, create object URL
        if (iconFileState instanceof File) {
            const obj = URL.createObjectURL(iconFileState);
            // revoke previous
            if (objectUrlRef.current) {
                try { URL.revokeObjectURL(objectUrlRef.current); } catch (e) {}
            }
            objectUrlRef.current = obj;
            setPreviewUrl(obj);
            return () => {
                try { URL.revokeObjectURL(obj); } catch (e) {}
                if (objectUrlRef.current === obj) objectUrlRef.current = null;
            };
        }

        // otherwise use iconUrlState or clear
        if (typeof iconUrlState === 'string' && iconUrlState.trim() !== '') {
            // clear previous object URL if any
            if (objectUrlRef.current) {
                try { URL.revokeObjectURL(objectUrlRef.current); } catch (e) {}
                objectUrlRef.current = null;
            }
            setPreviewUrl(iconUrlState.trim());
        } else {
            if (objectUrlRef.current) {
                try { URL.revokeObjectURL(objectUrlRef.current); } catch (e) {}
                objectUrlRef.current = null;
            }
            setPreviewUrl(null);
        }
        // cleanup on unmount
        return () => {
            if (objectUrlRef.current) {
                try { URL.revokeObjectURL(objectUrlRef.current); } catch (e) {}
                objectUrlRef.current = null;
            }
        };
    }, [iconFileState, iconUrlState]);

    return (
        <div className="max-w-2xl mx-auto">
            <Toaster position="top-right" />
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-slate-800">Create New Category</h1>
                <p className="text-sm text-slate-500 mt-1">Create and manage categories for the store.</p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-6 bg-white border border-slate-100 p-8 rounded-2xl shadow-sm"
            >
                <div className="grid grid-cols-1 gap-4">
                    <form.Field
                        name="name"
                        children={(field) => (
                            <div className="flex flex-col">
                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-widest">
                                    <LayoutGrid size={16} className="text-emerald-600" />
                                    Category Name
                                </label>
                                <input
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="e.g. Organic Fruits"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-all font-medium text-sm"
                                />
                            </div>
                        )}
                    />

                    <form.Field
                        name="subCategories"
                        children={(field) => (
                            <div className="flex flex-col">
                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-widest">
                                    <Layers size={16} className="text-emerald-600" />
                                    Subcategories
                                </label>
                                <input
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Comma separated, e.g. Mango, Banana"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-all font-medium text-sm"
                                />
                                <p className="text-xs text-slate-400 mt-1">Tip: separate names with commas</p>
                            </div>
                        )}
                    />

                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-widest">
                                <ImageIcon size={16} className="text-emerald-600" />
                                Icon (file or URL)
                            </label>

                            <div className="mt-2 space-y-2">
                                <form.Field
                                    name="iconFile"
                                    children={(field) => (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const f = e.target.files && e.target.files[0];
                                                field.handleChange(f || null);
                                                setIconFileState(f || null);
                                                if (!f) setIconUrlState('');
                                            }}
                                            className="w-full"
                                        />
                                    )}
                                />

                                <form.Field
                                    name="iconUrl"
                                    children={(field) => (
                                        <input
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => { field.handleChange(e.target.value); setIconUrlState(e.target.value); setIconFileState(null); }}
                                            placeholder="https://example.com/icon.png"
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-all text-sm"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="w-36 h-36 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                            {previewUrl ? (
                                <>
                                    <img src={previewUrl} alt="preview" className="object-cover w-full h-full" />
                                    <button type="button" onClick={() => { form.reset(); setIconFileState(null); setIconUrlState(''); setPreviewUrl(null); }} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow">
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <div className="text-xs text-slate-400">Preview</div>
                            )}
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 ${loading ? 'bg-emerald-300' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-black rounded-lg flex items-center justify-center gap-2 transition-colors uppercase tracking-widest text-sm`}
                >
                    <Send size={16} />
                    {loading ? 'Saving...' : 'Confirm & Save'}
                </motion.button>
            </form>
        </div>
    );
};

export default CreateCategory;