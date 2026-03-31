import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addByIncrement } from "../../store/reducers/cartSlice";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";

export default function Modal({ isOpen, closeModal, data }) {
  const [total, setTotal] = useState(1);
  const dispatch = useDispatch();

  if (!data) return null;

  const isOutOfStock = data.quantity <= 0;

  const handleAddToCart = (product) => {
    if (isOutOfStock) return;
    dispatch(addByIncrement({ product: product, cartQuantity: total }));
    closeModal();
  };

  const productImage = data.images && data.images.length > 0 
    ? data.images[0] 
    : "https://via.placeholder.com/400";

  const categoryName = data.parentCategory?.name || "Uncategorized";
  const subCategories = Array.isArray(data.parentCategory?.subCategories) 
    ? data.parentCategory.subCategories 
    : [];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-[20px] bg-white text-left align-middle transition-all relative">
                
                <button
                  onClick={closeModal}
                  className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 z-10"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col md:flex-row">
                  {/* Image Section */}
                  <div className="md:w-[45%] p-6 flex items-center justify-center bg-white">
                    <img
                      className="w-full h-auto object-contain max-h-[350px]"
                      src={productImage}
                      alt={data.title}
                    />
                  </div>

                  {/* Content Section */}
                  <div className="md:w-[55%] p-8 md:pl-0 flex flex-col justify-center">
                    <div className="space-y-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">{data.title}</h1>
                        <div className="mt-1">
                          {isOutOfStock ? (
                            <span className="text-[10px] bg-red-50 text-red-600 px-2.5 py-0.5 rounded font-bold border border-red-100">Stock Out</span>
                          ) : (
                            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded font-bold border border-emerald-100">In Stock</span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                        {data.description}
                      </p>

                      <div className="text-2xl font-bold text-gray-900">${data.price}</div>

                      {/* Quantity & Action Buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <div className={`flex items-center border border-gray-200 rounded h-10 bg-white ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : ''}`}>
                          <button
                            type="button"
                            onClick={() => setTotal(Math.max(1, total - 1))}
                            disabled={isOutOfStock || total <= 1}
                            className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-semibold text-sm text-gray-900">{total}</span>
                          <button
                            type="button"
                            onClick={() => setTotal(total + 1)}
                            disabled={isOutOfStock}
                            className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-gray-600 border-l border-gray-200 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleAddToCart(data)}
                          disabled={isOutOfStock}
                          className={`flex-1 font-bold text-xs h-10 rounded transition-all flex items-center justify-center gap-2
                            ${isOutOfStock 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-[#10b981] hover:bg-[#059669] text-white active:scale-95 shadow-sm shadow-emerald-100'}`}
                        >
                          <ShoppingCart size={16} />
                          {isOutOfStock ? "Out of Stock" : "Add To Cart"}
                        </button>
                      </div>

                      {/* Footer Info: Category & Subcategories */}
                      <div className="pt-6 border-t border-gray-100 space-y-3">
                        <div className="flex items-center gap-1 text-[11px] font-bold">
                          <span className="text-gray-400  ">Category:</span>
                          <span className="text-emerald-600">{categoryName}</span>
                        </div>

                        {subCategories.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {subCategories.map((sub, index) => (
                              <span 
                                key={index} 
                                className="text-[10px] bg-slate-50 text-slate-500 px-3 py-1 rounded-sm border border-slate-100 font-medium"
                              >
                                {sub.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}