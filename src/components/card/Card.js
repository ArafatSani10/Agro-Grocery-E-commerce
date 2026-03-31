import React, { useState } from "react";
import Modal from "../modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decreaseCart, incrementCart } from "../../store/reducers/cartSlice";

function Card({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const Cart = cart.cartItems.find((item) => item.id === data.id);

  const productImage = data.images && data.images.length > 0 
    ? data.images[0] 
    : "https://via.placeholder.com/160";

  return (
    <>
      <div className="group box-border overflow-hidden flex rounded-md shadow-sm flex-col items-center bg-white relative border border-gray-100">
        <div onClick={() => setIsOpen(true)} className="relative flex justify-center w-full cursor-pointer p-2">
          {data.discount && (
            <span className="absolute text-xs bg-orange-500 text-white py-1 px-2 rounded font-medium z-10 right-2 top-2">
              {Math.ceil(data.discount)}% Off
            </span>
          )}

          {data.quantity <= 0 && (
            <span className="absolute inline-flex items-center px-2 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-bold z-10 left-2 top-2">
              Stock Out
            </span>
          )}

          <img
            src={productImage}
            alt={data.title}
            className="object-cover transition duration-150 ease-linear transform group-hover:scale-105 w-[160px] h-[160px]"
          />
        </div>

        <div className="w-full px-3 pb-4">
          <div className="mb-2">
            <span className="text-emerald-500 font-medium text-[10px] uppercase tracking-wider">
              {data.parentCategory?.name || "General"}
            </span>
            <h2 className="text-sm font-semibold text-gray-700 truncate">
              {data.title}
            </h2>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-800">${data.price}</span>
              {data.originalPrice && data.originalPrice > data.price && (
                <del className="text-xs text-gray-400">${data.originalPrice}</del>
              )}
            </div>

            {Cart ? (
              <div className="flex items-center bg-emerald-500 text-white rounded h-8 px-2 gap-3">
                <button onClick={() => dispatch(decreaseCart(data))} className="hover:text-gray-200">-</button>
                <span className="text-xs font-bold">{Cart.cartQuantity}</span>
                <button onClick={() => dispatch(incrementCart(data))} className="hover:text-gray-200">+</button>
              </div>
            ) : (
              <button
                disabled={data.quantity <= 0}
                onClick={() => dispatch(addToCart(data))}
                className={`h-8 w-8 flex items-center justify-center border rounded text-emerald-500 transition-all ${
                  data.quantity <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-500 hover:text-white"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {isOpen && <Modal data={data} isOpen={isOpen} closeModal={() => setIsOpen(false)} />}
    </>
  );
}

export default Card;