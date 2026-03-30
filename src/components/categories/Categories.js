import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { searchAction } from "../../store/reducers/searchSlice";
import { useCategories } from "../../hooks/useCategories";

function Categories() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: categories, isLoading } = useCategories();

  const handleClick = (value) => {
    navigate("/search?Category=" + value);
    dispatch(searchAction({ value: value, path: "Category" }));
  };

  const SkeletonCard = () => (
    <li className="animate-pulse">
      <div className="flex h-full w-full border border-gray-100 bg-white p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="pl-4 flex-grow">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-16"></div>
        </div>
      </div>
    </li>
  );

  return (
    <div className="bg-gray-100 lg:py-16 py-10">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="mb-10 flex justify-center">
          <div className="text-center w-full lg:w-2/5">
            <h2 className="text-xl lg:text-2xl mb-2 font-semibold">
              Featured Categories
            </h2>
            <p className="text-base font-sans text-gray-600 leading-6">
              Choose your necessary products from this feature categories.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
          {isLoading ? (
            // লোডিং অবস্থায় ১২টি স্কেলিটন দেখাবে
            [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
          ) : (
            categories?.map((category, index) => {
              return (
                <li className="group" key={index}>
                  <div className="flex h-full w-full border border-gray-100 shadow-sm bg-white p-4 cursor-pointer transition duration-200 ease-linear transform group-hover:shadow-lg">
                    <div className="flex ">
                      <div className="flex items-center">
                        <div>
                          <span
                            className="!h-8 !w-8"
                            style={{
                              boxSizing: " border-box",
                              display: "inline-block",
                              overflow: "hidden",
                              width: "initial",
                              height: "initial",
                              background: "none",
                              opacity: "1",
                              border: " 0px",
                              margin: "0px",
                              padding: "0px",
                              position: "relative",
                              maxWidth: "100%",
                            }}
                          >
                            <span
                              style={{
                                boxSizing: "border-box",
                                display: "block",
                                width: "initial",
                                height: "initial",
                                background: "none",
                                opacity: "1",
                                border: "0px",
                                margin: "0px",
                                padding: "0px",
                                maxWidth: "100%",
                              }}
                            >
                              <img
                                alt=""
                                aria-hidden="true"
                                src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27100%27%20height=%27100%27/%3e"
                                style={{
                                  display: "block",
                                  maxWidth: "100%",
                                  width: "initial",
                                  height: "initial",
                                  background: "none",
                                  opacity: "1",
                                  border: "0px",
                                  margin: "0px",
                                  padding: "0px",
                                }}
                              />
                            </span>
                            <img
                              alt={category.name}
                              src={category.iconUrl || category.icon}
                              decoding="async"
                              data-nimg="intrinsic"
                              className="rounded-lg"
                              style={{
                                position: "absolute",
                                inset: "0px",
                                boxSizing: "border-box",
                                padding: "0px",
                                border: "none",
                                margin: "auto",
                                display: "block",
                                width: "0px",
                                height: "0px",
                                minWidth: "100%",
                                maxWidth: "100%",
                                minHeight: " 100%",
                                maxHeight: "100%",
                              }}
                            />
                          </span>
                        </div>
                      </div>
                      <div className="pl-4">
                        <h3 className="text-sm font-medium leading-tight line-clamp-1 ">
                          <Link
                            className=" !no-underline !text-gray-600 group-hover:!text-emerald-500 cursor-pointer "
                            to={"/search?Category=" + (category.path || category.id)}
                          >
                            {category.name}
                          </Link>
                        </h3>
                        <ul className="pt-1 mt-1">
                          {category.subCategories?.map((subCategory, subIndex) => {
                            return (
                              <li className="pt-1" key={subIndex}>
                                <Link
                                  onClick={() => handleClick(subCategory.path || subCategory.name)}
                                  className=" flex items-center text-xs !no-underline !text-gray-400 hover:!text-emerald-600 cursor-pointer "
                                  to={"/search?Category=" + (subCategory.path || subCategory.name)}
                                >
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 512 512"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="48"
                                      d="M184 112l144 144-144 144"
                                    ></path>
                                  </svg>
                                  {subCategory.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default Categories;