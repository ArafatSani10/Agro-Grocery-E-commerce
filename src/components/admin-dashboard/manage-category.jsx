"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, Image as ImageIcon, Loader2, Search, Trash2, UploadCloud } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../lib/api';

const ManageCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [newIconFile, setNewIconFile] = useState(null);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories/admin?limit=100');

            const finalData = res?.data || [];
            setCategories(Array.isArray(finalData) ? finalData : []);
        } catch (err) {
            toast.error("Failed to load categories");
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        const prevCategories = [...categories];
        setCategories(prev => prev.filter(cat => cat.id !== id));

        try {
            await api.delete(`/categories/${id}`);
            toast.success("Category deleted");
        } catch (err) {
            toast.error("Delete failed");
            setCategories(prevCategories); 
        }
    };

    // ======================
    // Update Category (Optimistic)
    // ======================
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', selectedCategory.name);

            if (selectedCategory.subCategoriesRaw) {
                const subCats = selectedCategory.subCategoriesRaw
                    .split(',')
                    .map(s => ({ name: s.trim() }))
                    .filter(s => s.name !== "");
                formData.append('subCategories', JSON.stringify(subCats));
            }

            if (newIconFile) {
                formData.append('icon', newIconFile);
            } else if (selectedCategory.iconUrl) {
                formData.append('iconUrl', selectedCategory.iconUrl);
            }

            const updatedCat = await api.put(`/categories/${selectedCategory.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setCategories(prev => prev.map(cat => cat.id === selectedCategory.id ? updatedCat : cat));

            toast.success("Category updated!");
            setIsEditModalOpen(false);
            setNewIconFile(null);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Update failed");
        } finally {
            setUpdateLoading(false);
        }
    };
const filteredCategories = categories.filter(cat => 
    cat.name?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
);
    return (
        <div className="w-full bg-white min-h-screen p-4">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Manage Categories</h1>
                    <p className="text-slate-400 text-sm italic">Manage your store's structure</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Icon</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Sub-Categories</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {loading ? (
                            <tr><td colSpan="4" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /></td></tr>
                        ) : filteredCategories.length === 0 ? (
                            <tr><td colSpan="4" className="py-20 text-center text-slate-400">No categories found.</td></tr>
                        ) : (
                            filteredCategories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-slate-50/50 group">
                                    <td className="px-6 py-3">
                                        <div className="w-10 h-10 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                                            {cat.iconUrl ? <img src={cat.iconUrl} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-slate-300" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 font-semibold text-slate-700">{cat.name}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {cat.children?.length > 0 ? (
                                                cat.children.slice(0, 3).map((sub, i) => (
                                                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg border border-slate-200 font-medium">
                                                        {sub.name}
                                                    </span>
                                                ))
                                            ) : <span className="text-slate-300 italic">None</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => { 
                                                    setSelectedCategory({
                                                        ...cat,
                                                        subCategoriesRaw: cat.children?.map(s => s.name).join(', ') || ''
                                                    }); 
                                                    setIsEditModalOpen(true); 
                                                }}
                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" onClick={() => setIsEditModalOpen(false)} />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-md p-6 rounded-lg border border-slate-200 relative z-10">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">Edit Category</h3>

                            <form onSubmit={handleUpdate} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase">Category Name</label>
                                    <input
                                        type="text"
                                        value={selectedCategory?.name || ''}
                                        onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 outline-none text-sm"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase">Sub-categories (Comma separated)</label>
                                    <textarea
                                        value={selectedCategory?.subCategoriesRaw || ''}
                                        onChange={(e) => setSelectedCategory({ ...selectedCategory, subCategoriesRaw: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 outline-none text-sm h-20 resize-none"
                                        placeholder="e.g. Laptop, Mobile, Camera"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase block">Category Icon</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                                            {newIconFile ? (
                                                <img src={URL.createObjectURL(newIconFile)} alt="" className="w-full h-full object-cover" />
                                            ) : selectedCategory?.iconUrl ? (
                                                <img src={selectedCategory.iconUrl} alt="" className="w-full h-full object-cover" />
                                            ) : <ImageIcon size={20} className="text-slate-300" />}
                                        </div>
                                        <label className="cursor-pointer bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-2">
                                            <UploadCloud size={14} /> Change Icon
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => setNewIconFile(e.target.files[0])} />
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2 text-slate-500 font-bold text-xs uppercase hover:bg-slate-50 rounded-lg transition-all border border-slate-200">Cancel</button>
                                    <button type="submit" disabled={updateLoading} className="flex-1 py-2 bg-blue-600 text-white font-bold text-xs uppercase rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-all flex items-center justify-center gap-2">
                                        {updateLoading ? <Loader2 size={14} className="animate-spin" /> : 'Save Changes'}
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

export default ManageCategory;
