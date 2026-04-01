import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useProducts } from "../../hooks/useProducts";
import CategoryCard from "../categoryCard/CategoryCard";
import NotFoundProduct from "../notFoundProduct/NotFoundProduct";
import ProductList from "../productList/ProductList";
import SliceCategory from "../sliceCategory/SliceCategory";

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
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="flex pt-10 lg:py-12">
          <div className="flex w-full">
            <div className="w-full">
              <CategoryCard />
              <SliceCategory />

              {isLoading ? (
                <div className="text-center py-10 text-gray-500">
                  Loading...
                </div>
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
  );
};

export default Search;
