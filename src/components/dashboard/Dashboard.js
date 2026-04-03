import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "../../lib/api";
import Table from "../table/Table";

const Dashboard = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: res } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => api.get("/orders/my"),
    retry: 1,
  });

  const orders = res?.data || (Array.isArray(res) ? res : []);
  const total = orders.length;
  const pending = orders.filter((o) => o.status === "PENDING").length;
  const processing = orders.filter((o) =>
    ["CONFIRMED", "SHIPPED"].includes(o.status),
  ).length;
  const completed = orders.filter((o) => o.status === "DELIVERED").length;

  const stats = [
    {
      label: "Total Order",
      value: total,
      color: "text-red-600 bg-red-200",
      icon: (
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      ),
    },
    {
      label: "Pending Order",
      value: pending,
      color: "text-orange-600 bg-orange-200",
      icon: (
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
      ),
    },
    {
      label: "Processing Order",
      value: processing,
      color: "text-indigo-600 bg-indigo-200",
      icon: (
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      ),
    },
    {
      label: "Complete Order",
      value: completed,
      color: "text-emerald-600 bg-emerald-200",
      icon: (
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ),
    },
  ];

  return (
    <div className="overflow-hidden">
      <h2 className="text-xl text-black font-semibold mb-5">Dashboard</h2>
      <div className="grid gap-4 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex h-full">
            <div className="flex items-center border border-gray-200 w-full rounded-lg p-4">
              <div
                className={`flex items-center justify-center p-3 rounded-full h-12 w-12 text-xl text-center mr-4 ${stat.color}`}
              >
                {stat.icon}
              </div>
              <div>
                <h5 className="leading-none mb-2 text-base font-medium text-gray-700">
                  {stat.label}
                </h5>
                <p className="text-xl font-bold leading-none text-gray-800">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Table title="Recent Orders" />
    </div>
  );
};

export default Dashboard;
