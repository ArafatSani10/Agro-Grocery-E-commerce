import React, { useEffect } from "react";
import Categories from "../components/categories/Categories";
import FastDeliveryCard from "../components/fastDeliveryCard/FastDeliveryCard";
import LatestDiscountCouponCode from "../components/latestDiscountCouponCode/LatestDiscountCouponCode";
import PopularProduct from "../components/popularProduct/PopularProduct";
import OrganicProductCard from "../components/organicProductCard/OrganicProductCard.js";
import Slider from "../components/slider/Slider";
import LatestDiscountedProduct from "../components/latestDiscountedProduct/LatestDiscountedProduct";
import Cart from "../components/cart/Cart";

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen">
        <Cart />

        <div className="bg-white">
          <div className="mx-auto py-5 max-w-screen-2xl px-3 sm:px-10">

            {/* 🔥 MAIN SECTION */}
            <div className="flex flex-col lg:flex-row gap-6">

              {/* slider */}
              <div className="w-full lg:w-3/5 h-[320px] lg:h-[360px]">
                <Slider />
              </div>

              {/* coupon */}
              <div className="w-full lg:w-2/5 h-[320px] lg:h-[360px] hidden lg:block">
                <LatestDiscountCouponCode />
              </div>

            </div>

            <OrganicProductCard />
          </div>
        </div>

        <Categories />
        <PopularProduct />
        <FastDeliveryCard />
        <LatestDiscountedProduct />
      </div>
    </div>
  );
}

export default Home;