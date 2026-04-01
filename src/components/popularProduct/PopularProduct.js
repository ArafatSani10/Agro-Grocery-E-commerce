import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiSearch, FiSliders, FiCheck, FiRotateCcw } from "react-icons/fi";
import Card from "../card/Card";
import ProductSkeleton from "../product/ProductSkeleton";
import { useProducts } from "../../hooks/useProducts";

function PopularProduct() {
  const { data: products = [], isLoading, isFetching } = useProducts();
  
  // States for Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("Default");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    result = result.filter((p) => p.price <= maxPrice);

    if (showInStockOnly) {
      result = result.filter((p) => p.stock > 0 || p.quantity > 0 || p.status === "active");
    }

    if (sortBy === "Low to High") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "High to Low") result.sort((a, b) => b.price - a.price);
    
    return result;
  }, [products, searchQuery, maxPrice, sortBy, showInStockOnly]);

  const isFiltered = searchQuery !== "" || maxPrice < 10000 || sortBy !== "Default" || showInStockOnly;

  const resetAll = () => {
    setSearchQuery("");
    setMaxPrice(10000);
    setSortBy("Default");
    setShowInStockOnly(false);
  };

  return (
    <div id="discount" className="bg-white lg:py-16 py-10 mx-auto max-w-screen-2xl px-4 sm:px-10">
      {/* --- Header Section --- */}
      <div className="mb-10 flex flex-col items-center text-center">
        <h2 className="text-2xl lg:text-3xl mb-2 text-slate-900 font-semibold">
          Popular Products for Daily Shopping
        </h2>
        <p className="text-slate-500 max-w-lg text-sm">
          See all our popular products in this week. Quality and freshness guaranteed.
        </p>
      </div>

      {/* --- Filter Bar --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
        <div className="flex flex-wrap flex-1 items-center gap-6 w-full">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Professional Toggle Switch */}
          <div 
            className="group flex items-center gap-3 cursor-pointer" 
            onClick={() => setShowInStockOnly(!showInStockOnly)}
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
          
          {isFiltered && (
            <button 
              onClick={resetAll}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors text-[13px] font-medium"
            >
              <FiRotateCcw size={14} />
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <span className="text-[13px] text-slate-400 font-medium">
            {filteredProducts.length} products
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
                      {/* Price Slider - Step set to 10 */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[12px] font-semibold text-slate-800">Price Limit</label>
                          <span className="text-[12px] font-medium text-slate-900 px-2 py-0.5 bg-slate-100 rounded">Under ${maxPrice}</span>
                        </div>
                        <input
                          type="range" min="0" max="10000" 
                          step="10" // ১০ টাকা করে বাড়বে
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(Number(e.target.value))}
                          className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                      </div>

                      <div className="h-[1px] bg-slate-100" />

                      {/* Sorting */}
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold text-slate-400 mb-2">Sort by</p>
                        {["Default", "Low to High", "High to Low"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {setSortBy(option); setIsOpen(false);}}
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

      {/* --- Grid Layout --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
        {isLoading ? (
          [...Array(10)].map((_, i) => <ProductSkeleton key={i} />)
        ) : filteredProducts.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((item) => (
              <motion.div 
                key={item.id} 
                layout 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card data={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm mb-4">No products found matching your filters.</p>
            {/* <button onClick={resetAll} className="text-[13px] font-medium text-slate-900 underline underline-offset-4">
              Clear all filters
            </button> */}
          </div>
        )}
      </div>

      {/* Modern Syncing Status */}
      {!isLoading && isFetching && (
        <div className="fixed bottom-6 right-6 bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-lg flex items-center gap-2.5 z-50">
          <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-pulse" />
          <span className="text-[12px] font-medium text-slate-600">Updating store...</span>
        </div>
      )}
    </div>
  );
}

export default PopularProduct;