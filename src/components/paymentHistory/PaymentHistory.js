import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useState } from "react";
import api from "../../lib/api";

const PAYMENT_STATUSES = ['PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED'];

const paymentStatusStyle = (status) => {
  switch (status) {
    case "SUCCEEDED":
      return "text-emerald-700 bg-emerald-100";
    case "PENDING":
      return "text-yellow-700 bg-yellow-100";
    case "FAILED":
      return "text-red-700 bg-red-100";
    case "REFUNDED":
      return "text-slate-600 bg-slate-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const orderStatusStyle = (status) => {
  switch (status) {
    case "CONFIRMED":
      return "text-blue-700 bg-blue-100";
    case "SHIPPED":
      return "text-purple-700 bg-purple-100";
    case "DELIVERED":
      return "text-emerald-700 bg-emerald-100";
    case "CANCELLED":
      return "text-red-700 bg-red-100";
    default:
      return "text-yellow-700 bg-yellow-100";
  }
};

const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["payment-history"],
    queryFn: () => api.get("/payments/my"),
    retry: 1,
  });

  const raw = res?.data || (Array.isArray(res) ? res : []);

  const payments = [...raw]
    .filter(p => {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q || p.order?.invoce?.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) =>
      sortOrder === 'desc'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  return (
    <div className="overflow-hidden">
      {/* Header + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-xl text-black font-semibold">Payment History</h2>
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
          {/* Payment status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none focus:border-emerald-400"
          >
            <option value="ALL">All Payments</option>
            {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
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
        <div className="align-middle inline-block min-w-full pb-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden border border-gray-100 rounded-md">
            {isLoading ? (
              <p className="text-center py-8 text-gray-500">
                Loading payments...
              </p>
            ) : isError ? (
              <p className="text-center py-8 text-red-500">
                Failed to load payment history.
              </p>
            ) : payments.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No payment history found.
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
                      Method
                    </th>
                    <th className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="text-left text-xs font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider">
                      Order Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-emerald-700">
                          {payment.order?.invoce
                            ? `#${payment.order.invoce}`
                            : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">
                        {moment(payment.createdAt).format("MMM DD, YYYY")}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-600 capitalize">
                        {payment.method || "—"}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm font-bold text-gray-800">
                        {formatter.format(payment.amount)}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${paymentStatusStyle(payment.status)}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {payment.order?.status ? (
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${orderStatusStyle(payment.order.status)}`}
                          >
                            {payment.order.status}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
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
  );
};

export default PaymentHistory;
