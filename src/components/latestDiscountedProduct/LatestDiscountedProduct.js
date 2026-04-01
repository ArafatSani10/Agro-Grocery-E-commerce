import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiSearch, FiSliders, FiCheck, FiRotateCcw, FiPercent } from "react-icons/fi";
import Card from "../card/Card";
import ProductSkeleton from "../product/ProductSkeleton";
import { useProducts } from "../../hooks/useProducts";

function LatestDiscountedProduct() {
  const { data: products = [], isLoading, isFetching } = useProducts();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("Default");
  const [isOpen, setIsOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => (
      p.discount !== null && Number(p.discount) > 0
    ));

    if (searchQuery) {
      result = result.filter((p) => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result = result.filter((p) => p.price <= maxPrice);

    if (sortBy === "Low to High") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "High to Low") result.sort((a, b) => b.price - a.price);
    
    return result;
  }, [products, searchQuery, maxPrice, sortBy]);

  const isFiltered = searchQuery !== "" || maxPrice < 10000 || sortBy !== "Default";

  const resetAll = () => {
    setSearchQuery("");
    setMaxPrice(10000);
    setSortBy("Default");
  };

  return (
    <div id="discount" className="bg-white lg:py-16 py-10 mx-auto max-w-screen-2xl px-4 sm:px-10">
      
      <div className="mb-10 flex flex-col items-center text-center">
        
        <h2 className="text-2xl lg:text-3xl mb-2 text-slate-900 font-semibold leading-tight">
          Latest Discounted Products
        </h2>
        <p className="text-slate-500 max-w-lg text-sm">
          Get the best deals on your daily essentials. High quality products with exclusive price drops.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
        <div className="flex flex-wrap flex-1 items-center gap-6 w-full">
          
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input 
              type="text"
              placeholder="Search in offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all"
            />
          </div>

          {isFiltered && (
            <button 
              onClick={resetAll}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors text-[13px] font-medium"
            >
              <FiRotateCcw size={14} /> Reset
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <span className="text-[13px] text-slate-400 font-medium">
            {filteredProducts.length} items found
          </span>
          
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-between gap-2 border border-slate-200 bg-white h-10 px-4 rounded-lg text-[13px] font-medium hover:bg-slate-50 transition-all min-w-[150px] text-slate-700"
            >
              <div className="flex items-center gap-2">
                <FiSliders size={14} />
                <span>Sort & Filter</span>
              </div>
              <FiChevronDown className={`opacity-40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-5 shadow-xl z-50 origin-top-right"
                  >
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[12px] font-semibold text-slate-800">Max Price</label>
                          <span className="text-[12px] font-medium text-slate-900 px-2 py-0.5 bg-slate-100 rounded">${maxPrice}</span>
                        </div>
                        <input
                          type="range" min="0" max="10000" step="10"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                      </div>

                      <div className="h-[1px] bg-slate-100" />

                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold text-slate-400 mb-2">Order By</p>
                        {["Default", "Low to High", "High to Low"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {setSortBy(option); setIsOpen(false);}}
                            className={`flex w-full items-center justify-between py-2 px-3 text-[13px] rounded-md transition-all ${sortBy === option ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
        {isLoading ? (
          [...Array(12)].map((_, i) => <ProductSkeleton key={i} />)
        ) : filteredProducts.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((item) => (
              <motion.div 
                key={item.id} 
                layout 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card data={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-span-full py-24 text-center flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/30">
            <p className="text-slate-400 text-sm mb-4 font-medium">No discounted products found matching your filters.</p>
            <button onClick={resetAll} className="text-sm font-bold text-slate-900 underline underline-offset-4 hover:text-emerald-600 transition-colors">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {!isLoading && isFetching && (
        <div className="fixed bottom-6 right-6 bg-white border border-slate-200 shadow-lg px-4 py-2 rounded-full flex items-center gap-2.5 z-50">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[12px] font-bold text-slate-700 uppercase tracking-tight">Updating deals...</span>
        </div>
      )}
    </div>
  );
}

export default LatestDiscountedProduct;