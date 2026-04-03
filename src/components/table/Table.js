import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const statusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "text-yellow-600 bg-yellow-100";
    case "CONFIRMED":
      return "text-blue-600 bg-blue-100";
    case "SHIPPED":
      return "text-purple-600 bg-purple-100";
    case "DELIVERED":
      return "text-emerald-600 bg-emerald-100";
    case "CANCELLED":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const paymentColor = (status) => {
  switch (status) {
    case "SUCCEEDED":
      return "text-emerald-600 bg-emerald-100";
    case "PENDING":
      return "text-yellow-600 bg-yellow-100";
    case "FAILED":
      return "text-red-600 bg-red-100";
    case "REFUNDED":
      return "text-slate-500 bg-slate-100";
    default:
      return "text-gray-500 bg-gray-100";
  }
};

const Table = ({ title }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc');

  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => api.get("/orders/my"),
    retry: 1,
  });

  const raw = res?.data || (Array.isArray(res) ? res : []);

  const orders = [...raw]
    .filter(o => {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q || o.invoce?.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) =>
      sortOrder === 'desc'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="rounded-md">
        <div className="flex flex-col">
          {/* Header + Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            {title && <h3 className="text-lg font-medium">{title}</h3>}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Search by invoice..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none focus:border-emerald-400 w-full sm:w-52"
                />
              </div>
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none focus:border-emerald-400"
              >
                <option value="ALL">All Statuses</option>
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {/* Sort */}
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none focus:border-emerald-400"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
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
                        <th className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider">
                          Invoice
                        </th>
                        <th className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider">
                          Order Status
                        </th>
                        <th className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider">
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
                          <td className="px-5 py-3 leading-6 whitespace-nowrap">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${paymentColor(order.payments?.[0]?.status)}`}
                            >
                              {order.payments?.[0]?.status || "N/A"}
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
