import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  couponCode: null,
  couponId: null,
  discountAmount: 0,
  discountPercentage: 0,
  shippingOption: "FedEx",
  shippingCost: 60,
};

export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = state.cartItems.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (product >= 0) {
        state.cartItems[product].cartQuantity += 1;
      } else {
        const tempProduct = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProduct);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    removeFromCart(state, action) {
      state.cartItems.map((cartItem) => {
        if (cartItem.id === action.payload.id) {
          const nextCartItems = state.cartItems.filter(
            (item) => item.id !== cartItem.id,
          );

          state.cartItems = nextCartItems;
        }
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        return state;
      });
    },
    decreaseCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id,
      );

      if (state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    incrementCart(state, action) {
      const product = state.cartItems.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (product >= 0) {
        state.cartItems[product].cartQuantity += 1;
      } else {
        const tempProduct = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProduct);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    addByIncrement(state, action) {
      const product = state.cartItems.findIndex(
        (item) => item.id === action.payload.product.id,
      );
      if (product >= 0) {
        state.cartItems[product].cartQuantity += action.payload.cartQuantity;
      } else {
        const cartQuantity =
          action.payload.cartQuantity === 1 ? 1 : action.payload.cartQuantity;
        const tempProduct = { ...action.payload.product, cartQuantity };
        state.cartItems.push(tempProduct);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    getTotals(state, action) {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem;
          const itemTotal = price * cartQuantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += cartQuantity;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        },
      );
      total = parseFloat(total.toFixed(2));
      state.cartTotalQuantity = quantity;
      state.cartTotalAmount = total;

      // Recompute discount whenever total changes (coupon percentage stays fixed)
      if (state.discountPercentage > 0) {
        state.discountAmount = parseFloat(
          ((total * state.discountPercentage) / 100).toFixed(2),
        );
      }
    },
    setShippingOption(state, action) {
      const costs = { FedEx: 60, UPS: 20 };
      state.shippingOption = action.payload;
      state.shippingCost = costs[action.payload] ?? 0;
    },
    applyCoupon(state, action) {
      state.couponCode = action.payload.couponCode;
      state.couponId = action.payload.couponId || null;
      state.discountAmount = action.payload.discountAmount || 0;
      state.discountPercentage = action.payload.percentage || 0;
    },
    removeCoupon(state) {
      state.couponCode = null;
      state.couponId = null;
      state.discountAmount = 0;
      state.discountPercentage = 0;
    },
    clearCart(state) {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
      state.couponCode = null;
      state.couponId = null;
      state.discountAmount = 0;
      state.discountPercentage = 0;
      state.shippingOption = "FedEx";
      state.shippingCost = 60;
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  decreaseCart,
  incrementCart,
  getTotals,
  addByIncrement,
  applyCoupon,
  removeCoupon,
  clearCart,
  setShippingOption,
} = CartSlice.actions;

export const cartReducer = CartSlice.reducer;
