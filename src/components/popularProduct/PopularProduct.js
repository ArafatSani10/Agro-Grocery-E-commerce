import React, { useMemo } from "react";
import Card from "../card/Card";
import ProductSkeleton from "../product/ProductSkeleton";
import { useProducts } from "../../hooks/useProducts";

function PopularProduct() {
  const { data: products, isLoading, isFetching } = useProducts();

  const skeletonItems = useMemo(() => [...Array(10)].map((_, i) => <ProductSkeleton key={i} />), []);

  return (
    <div id="discount" className="bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10">
      <div className="mb-10 flex justify-center">
        <div className="text-center w-full lg:w-2/5">
          <h2 className="text-xl lg:text-2xl mb-2 text-black font-semibold">
            Popular Products for Daily Shopping
          </h2>
          <p className="text-base text-gray-600 leading-6">
            See all our popular products in this week.
          </p>
        </div>
      </div>

      <div className="flex">
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3 ">
            {isLoading ? (
              skeletonItems
            ) : (
              products?.map((item) => (
                <Card key={item.id} data={item} />
              ))
            )}
          </div>

          {!isLoading && isFetching && (
            <div className="fixed bottom-5 right-5 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs animate-pulse">
              Updating...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PopularProduct;