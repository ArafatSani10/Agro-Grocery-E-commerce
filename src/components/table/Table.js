import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Link } from "react-router-dom";
import api from "../../lib/api";

const Table = ({ title, data, children }) => {
  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => api.get("/orders/my"),
    retry: 1,
  });

  const orders = res?.data || (Array.isArray(res) ? res : []);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const statusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "PROCESSING":
        return "text-blue-600 bg-blue-100";
      case "DELIVERED":
        return "text-emerald-600 bg-emerald-100";
      case "CANCELLED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="rounded-md">
        <div className="flex flex-col">
          {title && <h3 className="text-lg font-medium mb-5">{title}</h3>}
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="align-middle inline-block rounded-md min-w-full pb-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b last:border-b-0 border-gray-100 rounded-md">
                {isLoading ? (
                  <p className="text-center py-8 text-gray-500">
                    Loading orders...
                  </p>
                ) : isError ? (
                  <p className="text-center py-8 text-red-500">
                    Failed to load orders.
                  </p>
                ) : orders.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">
                    No orders found.
                  </p>
                ) : (
                  <table className="table-auto min-w-full border border-gray-100 divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="bg-gray-100">
                        <th
                          scope="col"
                          className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                        >
                          Invoice
                        </th>
                        <th
                          scope="col"
                          className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                        >
                          Items
                        </th>
                        <th
                          scope="col"
                          className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-5 py-3 leading-6 whitespace-nowrap">
                            <span className="text-sm font-medium">
                              #{order.invoce}
                            </span>
                          </td>
                          <td className="px-5 py-3 leading-6 whitespace-nowrap text-sm text-gray-500">
                            {moment(order.createdAt).format("MMM DD, YYYY")}
                          </td>
                          <td className="px-5 py-3 leading-6 whitespace-nowrap">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor(order.status)}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 leading-6 whitespace-nowrap text-sm text-gray-500">
                            {order.cartTotalQuantity} item(s)
                          </td>
                          <td className="px-5 py-3 leading-6 whitespace-nowrap text-sm font-bold">
                            {formatter.format(
                              order.finalAmount ?? order.cartTotalAmount,
                            )}
                          </td>
                          <td className="px-5 py-3 leading-6 whitespace-nowrap">
                            <Link
                              to={`/order/${order.id}`}
                              className="text-sm text-emerald-600 hover:text-emerald-800 font-semibold no-underline"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
