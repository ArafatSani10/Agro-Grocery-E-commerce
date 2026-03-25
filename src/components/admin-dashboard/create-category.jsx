import { useForm } from '@tanstack/react-form';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Layers, LayoutGrid, Send } from 'lucide-react';
import api from '../../lib/api';

const CreateCategory = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    console.log(API_URL)

    const form = useForm({
        defaultValues: {
            name: '',
            subCategories: '',
            iconFile: null,
            iconUrl: '',
        },
        onSubmit: async ({ value }) => {
            try {
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

                // use axios instance
                try {
                    await api.post('/categories', formData);
                    alert('Category created successfully!');
                    form.reset();
                } catch (err) {
                    console.error('Submission Error:', err);
                    alert(`Error: ${err?.message || 'Something went wrong'}`);
                }
            } catch (error) {
                console.error('Submission Error:', error);
                alert('Submission failed. See console for details.');
            }
        },
    });

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Create New Category</h1>
                <p className="text-sm text-slate-500 font-bold mt-1 tracking-tight">Backend Endpoint: <span className="text-emerald-600 underline">{API_URL}/categories</span></p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-6 bg-white border border-slate-200 p-8 rounded-xl"
            >
                <form.Field
                    name="name"
                    children={(field) => (
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-700 uppercase tracking-widest">
                                <LayoutGrid size={14} className="text-emerald-600" />
                                Category Name
                            </label>
                            <input
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="e.g. Organic Fruits"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm"
                            />
                        </div>
                    )}
                />

                <form.Field
                    name="subCategories"
                    children={(field) => (
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-700 uppercase tracking-widest">
                                <Layers size={14} className="text-emerald-600" />
                                Subcategories (comma separated)
                            </label>
                            <input
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="e.g. Mango, Banana, Apple"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm"
                            />
                        </div>
                    )}
                />

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-700 uppercase tracking-widest">
                        <ImageIcon size={14} className="text-emerald-600" />
                        Icon Upload (or enter URL below)
                    </label>
                    <form.Field
                        name="iconFile"
                        children={(field) => (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files && e.target.files[0];
                                    field.handleChange(f || null);
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
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Provide image URL e.g. https://image-link.com (used if no file)"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm"
                            />
                        )}
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg flex items-center justify-center gap-2 transition-colors uppercase tracking-widest text-[11px]"
                >
                    <Send size={16} />
                    Confirm & Save
                </motion.button>
            </form>
        </div>
    );
};

export default CreateCategory;