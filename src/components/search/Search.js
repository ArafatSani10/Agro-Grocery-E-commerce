import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import CategoryCard from "../categoryCard/CategoryCard";
import NotFoundProduct from "../notFoundProduct/NotFoundProduct";
import ProductList from "../productList/ProductList";
import SliceCategory from "../sliceCategory/SliceCategory";

// --- Skeleton Loader Component ---
const ProductSkeleton = () => {
  return (
    <div className="mt-6">
      {/* Search Result Bar Skeleton */}
      <div className="h-12 w-full bg-orange-50 animate-pulse border border-gray-100 rounded mb-4"></div>
      
      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm animate-pulse">
            {/* Image Area */}
            <div className="w-full aspect-square bg-gray-200 rounded-md mb-3"></div>
            {/* Title Lines */}
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            {/* Price and Action */}
            <div className="flex justify-between items-center mt-auto">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 w-8 bg-emerald-50 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Search Component ---
const Search = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("Category");
  const query = searchParams.get("query");

  const params = {};
  if (category) params.category = category;
  if (query) params.q = query;

  const { data: products = [], isLoading } = useProducts(params);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category, query]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="flex pt-10 lg:py-12">
          <div className="flex w-full">
            <div className="w-full">
              {/* Top Section */}
              <CategoryCard />
              <SliceCategory />

              {/* Dynamic Content Section */}
              <div className="mt-4">
                {isLoading ? (
                  <ProductSkeleton />
                ) : products.length >= 1 ? (
                  <ProductList data={products} />
                ) : (
                  <NotFoundProduct />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;