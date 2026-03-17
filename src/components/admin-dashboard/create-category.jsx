import React from 'react';
import { useForm } from '@tanstack/react-form';
import { motion } from 'framer-motion';
import { LayoutGrid, Layers, Image as ImageIcon, Send } from 'lucide-react';

const CreateCategory = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const form = useForm({
        defaultValues: {
            name: '',
            subcategory: '',
            icons: '',
        },
        onSubmit: async ({ value }) => {
            try {
                const response = await fetch(`${API_URL}/categories`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(value),
                });
                
                if (response.ok) {
                    alert('Category created successfully!');
                    form.reset();
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || 'Something went wrong'}`);
                }
            } catch (error) {
                console.error('Submission Error:', error);
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
                    name="subcategory"
                    children={(field) => (
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-700 uppercase tracking-widest">
                                <Layers size={14} className="text-emerald-600" />
                                Subcategory
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

                <form.Field
                    name="icons"
                    children={(field) => (
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-700 uppercase tracking-widest">
                                <ImageIcon size={14} className="text-emerald-600" />
                                Icon URL
                            </label>
                            <input
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="e.g. https://image-link.com"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm"
                            />
                        </div>
                    )}
                />

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