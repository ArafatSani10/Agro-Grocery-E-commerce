import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Logo from "../../assets/icon/logo-color.svg";
import api from "../../lib/api";

function Order() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { id } = useParams();

  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => api.get(`/orders/${id}`),
    enabled: !!id,
    retry: 1,
  });

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading order...</p>
      </div>
    );
  }

  if (isError || !res) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Order not found.</p>
      </div>
    );
  }

  const data = res?.data || res;
  const orderItems = data.orderItems || [];
  const shippingCost =
    data.shippingCost != null
      ? data.shippingCost
      : data.shippingOption === "FedEx"
        ? 60
        : 20;
  const discountAmount = data.discountAmount || 0;
  const finalAmount = data.finalAmount ?? data.cartTotalAmount;

  return (
    <div className="bg-gray-50">
      <div className="max-w-screen-2xl mx-auto py-10 px-3 sm:px-6">
        <div className="!bg-emerald-100 rounded-md mb-5 px-4 py-3">
          <label>
            Thank you{" "}
            <span className="font-bold text-emerald-600">
              {data.firstName} {data.lastName},
            </span>{" "}
            Your order has been received!
          </label>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <div>
            <div className="bg-indigo-50 p-8 rounded-t-xl">
              <div className="flex lg:flex-row md:flex-col lg:items-center justify-between pb-4 border-b border-gray-50">
                <h1 className="font-bold text-2xl uppercase">Invoice</h1>
                <div className="lg:text-right text-left">
                  <h2 className="text-lg font-semibold mt-4 lg:mt-0 md:mt-0">
                    <Link to="/">
                      <img
                        alt="logo"
                        src={Logo}
                        className="rounded-lg h-10 inline-block"
                      />
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Agro Grocery Store
                  </p>
                </div>
              </div>
              <div className="flex lg:flex-row md:flex-row flex-col justify-between pt-4">
                <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                  <span className="font-bold text-sm uppercase text-gray-600 block">
                    Date
                  </span>
                  <span className="text-sm text-gray-500 block">
                    {moment(data.createdAt || data.createdDate).format(
                      "MMMM DD, YYYY",
                    )}
                  </span>
                </div>
                <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                  <span className="font-bold text-sm uppercase text-gray-600 block">
                    Invoice No.
                  </span>
                  <span className="text-sm text-gray-500 block">
                    #{data.invoce}
                  </span>
                </div>
                <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                  <span className="font-bold text-sm uppercase text-gray-600 block">
                    Status
                  </span>
                  <span className="text-sm font-semibold text-emerald-600 block capitalize">
                    {data.status?.toLowerCase() || "pending"}
                  </span>
                </div>
                <div className="flex flex-col lg:text-right text-left">
                  <span className="font-bold text-sm uppercase text-gray-600 block">
                    Invoice To.
                  </span>
                  <span className="text-sm text-gray-500 block">
                    {data.firstName} {data.lastName}
                    <br />
                    {data.streetAddress}
                    <br />
                    {data.city}, {data.country}, {data.zipPostal}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="overflow-hidden lg:overflow-visible px-8 my-10">
                <div className="-my-2 overflow-x-auto">
                  <table className="table-auto min-w-full border border-gray-100 divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="text-xs bg-gray-100">
                        <th
                          scope="col"
                          className="font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-left"
                        >
                          Sr.
                        </th>
                        <th
                          scope="col"
                          className="font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-left"
                        >
                          Product Name
                        </th>
                        <th
                          scope="col"
                          className="font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-center"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-center"
                        >
                          Item Price
                        </th>
                        <th
                          scope="col"
                          className="font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-right"
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 text-serif text-sm">
                      {orderItems.map((item, index) => (
                        <tr key={item.id || index}>
                          <th className="px-6 py-1 whitespace-nowrap font-normal text-gray-500 text-left">
                            {index + 1}
                          </th>
                          <td className="px-6 py-1 whitespace-nowrap font-normal text-gray-500">
                            {item.title}
                          </td>
                          <td className="px-6 py-1 whitespace-nowrap font-bold text-center">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-1 whitespace-nowrap font-bold text-center">
                            {formatter.format(item.price)}
                          </td>
                          <td className="px-6 py-1 whitespace-nowrap text-right font-bold text-red-500">
                            {formatter.format(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="border-t border-b border-gray-100 p-10 bg-emerald-50">
              <div className="flex lg:flex-row md:flex-row flex-col justify-between pt-4">
                <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold text-sm uppercase text-gray-600 block">
                    Payment Method
                  </span>
                  <span className="text-sm text-gray-500 font-semibold block">
                    {data.paymentMethod}
                  </span>
                </div>
                <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold text-sm uppercase text-gray-600 block">
                    Shipping
                  </span>
                  <span className="text-sm text-gray-500 font-semibold block">
                    {data.shippingOption} — {formatter.format(shippingCost)}
                  </span>
                </div>
                <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold text-sm uppercase text-gray-600 block">
                    Discount
                  </span>
                  <span className="text-sm font-semibold block text-orange-500">
                    - {formatter.format(discountAmount)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold text-sm uppercase text-gray-600 block">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-red-500 block">
                    {formatter.format(finalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-b-xl">
            <div className="flex lg:flex-row md:flex-row sm:flex-row flex-col justify-between">
              <button
                onClick={() => window.print()}
                className="mb-3 sm:mb-0 md:mb-0 lg:mb-0 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white transition-all font-serif text-sm font-semibold h-10 py-2 px-5 rounded-md"
              >
                Print Invoice{" "}
                <span className="ml-2">
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
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M384 368h24a40.12 40.12 0 0040-40V168a40.12 40.12 0 00-40-40H104a40.12 40.12 0 00-40 40v160a40.12 40.12 0 0040 40h24"
                    ></path>
                    <rect
                      width="256"
                      height="208"
                      x="128"
                      y="240"
                      fill="none"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      rx="24.32"
                      ry="24.32"
                    ></rect>
                    <path
                      fill="none"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M384 128v-24a40.12 40.12 0 00-40-40H168a40.12 40.12 0 00-40 40v24"
                    ></path>
                    <circle cx="392" cy="184" r="24"></circle>
                  </svg>
                </span>
              </button>
              <Link
                to="/user/my-orders"
                className="mb-3 sm:mb-0 md:mb-0 lg:mb-0 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white transition-all font-serif text-sm font-semibold h-10 py-2 px-5 rounded-md no-underline"
              >
                My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;
