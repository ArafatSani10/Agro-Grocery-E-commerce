import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiSearch, FiSliders, FiCheck, FiRotateCcw } from "react-icons/fi";
import Card from "../card/Card";
import Pagination from "../pagination/Pagination";

let PageSize = 12;

const ProductList = ({ data, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Default");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Clear All Filters Logic
  const clearFilters = () => {
    setSearchQuery("");
    setMaxPrice(10000);
    setSortBy("Default");
    setShowInStockOnly(false);
    setCurrentPage(1);
  };

  const isFiltered = searchQuery !== "" || maxPrice < 10000 || sortBy !== "Default" || showInStockOnly;

  // Filter & Sort Logic
  const processedData = useMemo(() => {
    let result = [...data];

    // Search Filter
    if (searchQuery) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price Filter
    result = result.filter((item) => item.price <= maxPrice);

    // Stock Filter (Active products only)
    if (showInStockOnly) {
      result = result.filter((p) => p.stock > 0 || p.quantity > 0 || p.status === "active");
    }

    // Sorting
    if (sortBy === "Low to High") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "High to Low") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "Newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return result;
  }, [data, sortBy, searchQuery, maxPrice, showInStockOnly]);

  // Pagination Logic
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return processedData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, processedData]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-[4/5] bg-slate-50 rounded-xl animate-pulse border border-slate-100"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* --- Modern Filter Bar --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
        
        <div className="flex flex-wrap flex-1 items-center gap-6 w-full">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Professional Toggle Switch */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => { setShowInStockOnly(!showInStockOnly); setCurrentPage(1); }}
          >
            <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${showInStockOnly ? 'bg-slate-900' : 'bg-slate-200'}`}>
              <motion.div 
                animate={{ x: showInStockOnly ? 22 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
              />
            </div>
            <span className={`text-[13px] font-medium transition-colors ${showInStockOnly ? 'text-slate-900' : 'text-slate-500'}`}>
              In stock only
            </span>
          </div>

          {/* Reset Button */}
          <AnimatePresence>
            {isFiltered && (
              <motion.button
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors text-[13px] font-medium"
              >
                <FiRotateCcw size={14} />
                <span>Reset</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <span className="text-[13px] text-slate-400 font-medium">
            {processedData.length} items
          </span>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-between gap-2 border border-slate-200 bg-white h-10 px-4 rounded-lg text-[13px] font-medium hover:bg-slate-50 transition-all min-w-[150px] text-slate-700"
            >
              <div className="flex items-center gap-2">
                <FiSliders size={14} />
                <span>Filter & Sort</span>
              </div>
              <FiChevronDown className={`opacity-40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-5 shadow-xl z-50 origin-top-right"
                  >
                    <div className="space-y-6">
                      {/* Price Slider - 10 step */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[12px] font-semibold text-slate-800">Price Limit</label>
                          <span className="text-[12px] font-medium text-slate-900 px-2 py-0.5 bg-slate-100 rounded">Under ${maxPrice}</span>
                        </div>
                        <input
                          type="range" min="0" max="10000" 
                          step="10" 
                          value={maxPrice}
                          onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
                          className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                      </div>

                      <div className="h-[1px] bg-slate-100" />

                      {/* Sorting Options */}
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold text-slate-400 mb-2">Sort by</p>
                        {["Default", "Low to High", "High to Low", "Newest"].map((option) => (
                          <button
                            key={option}
                            onClick={() => { setSortBy(option); setIsOpen(false); setCurrentPage(1); }}
                            className={`flex w-full items-center justify-between py-2 px-3 text-[13px] rounded-md transition-all ${sortBy === option ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                            {option}
                            {sortBy === option && <FiCheck size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* --- Animated Grid Layout --- */}
      {processedData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {currentTableData.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card data={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-slate-200 bg-slate-50/30">
            <p className="text-[13px] text-slate-500 mb-4 font-medium">No products match your current filters.</p>
            <button 
              onClick={clearFilters}
              className="text-[13px] font-semibold text-slate-900 underline underline-offset-4 hover:opacity-70 transition-all"
            >
              Clear all filters
            </button>
        </div>
      )}

      {/* --- Pagination --- */}
      {processedData.length > PageSize && (
        <div className="flex items-center justify-center pt-10">
          <Pagination
            currentPage={currentPage}
            totalCount={processedData.length}
            pageSize={PageSize}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;