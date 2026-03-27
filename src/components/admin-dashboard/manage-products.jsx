import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Loader2, X, Search, Image as ImageIcon, UploadCloud, Package, DollarSign } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Edit Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [newImageFile, setNewImageFile] = useState(null);

    // Fetch Products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/products');
            const finalData = res.data?.data || res.data?.products || res.data || [];
            setProducts(Array.isArray(finalData) ? finalData : []);
        } catch (err) {
            toast.error("Failed to load products");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Delete Product
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success("Product deleted successfully");
            setProducts(prev => prev.filter(prod => prod.id !== id));
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    // Update Product
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', selectedProduct.title);
            formData.append('price', selectedProduct.price);
            formData.append('description', selectedProduct.description || '');

            // Image logic: New file has priority
            if (newImageFile) {
                formData.append('images', newImageFile); // Backend multi-image field name onujayi
            }

            await api.put(`/products/${selectedProduct.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Product updated!");
            setIsEditModalOpen(false);
            setNewImageFile(null);
            fetchProducts();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Update failed");
        } finally {
            setUpdateLoading(false);
        }
    };

    const filteredProducts = Array.isArray(products) 
        ? products.filter(prod => prod.title.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    return (
        <div className="w-full bg-white min-h-screen p-4">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Manage Products</h1>
                    <p className="text-slate-400 text-sm italic">Inventory control and product management</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search products..."
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
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Image</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Product Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Price</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {loading ? (
                            <tr><td colSpan="4" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /></td></tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr><td colSpan="4" className="py-20 text-center text-slate-400">No products found.</td></tr>
                        ) : (
                            filteredProducts.map((prod) => (
                                <tr key={prod.id} className="hover:bg-slate-50/50 group">
                                    <td className="px-6 py-3">
                                        <div className="w-12 h-12 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                                            {prod.images?.[0] || prod.imageUrl ? (
                                                <img src={prod.images?.[0] || prod.imageUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon size={18} className="text-slate-300" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-700">{prod.title}</span>
                                            <span className="text-[11px] text-slate-400 truncate max-w-[200px]">{prod.description || 'No description'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 font-medium text-emerald-600">
                                        ${prod.price}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => { 
                                                    setSelectedProduct(prod); 
                                                    setIsEditModalOpen(true); 
                                                }}
                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(prod.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
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
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-md p-6 rounded-2xl border border-slate-200 relative z-10 shadow-2xl">
                            <div className="flex justify-between items-center mb-6 border-b pb-3">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Package size={20} className="text-blue-600" /> Edit Product
                                </h3>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase">Product Title</label>
                                    <input
                                        type="text"
                                        value={selectedProduct?.title || ''}
                                        onChange={(e) => setSelectedProduct({ ...selectedProduct, title: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase">Price</label>
                                    <div className="relative">
                                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            value={selectedProduct?.price || ''}
                                            onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase block">Product Image</label>
                                    <div className="flex items-center gap-4 p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                                        <div className="w-14 h-14 border border-slate-200 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                                            {newImageFile ? (
                                                <img src={URL.createObjectURL(newImageFile)} alt="" className="w-full h-full object-cover" />
                                            ) : (selectedProduct?.images?.[0] || selectedProduct?.imageUrl) ? (
                                                <img src={selectedProduct?.images?.[0] || selectedProduct?.imageUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon size={24} className="text-slate-200" />
                                            )}
                                        </div>
                                        <label className="cursor-pointer bg-white px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                                            <UploadCloud size={14} /> Replace Image
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => setNewImageFile(e.target.files[0])} />
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 text-slate-500 font-bold text-xs uppercase hover:bg-slate-50 rounded-xl transition-all border border-slate-200">Cancel</button>
                                    <button type="submit" disabled={updateLoading} className="flex-1 py-3 bg-blue-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-blue-700 disabled:bg-blue-300 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                                        {updateLoading ? <Loader2 size={16} className="animate-spin" /> : 'Update Product'}
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

export default ManageProducts;