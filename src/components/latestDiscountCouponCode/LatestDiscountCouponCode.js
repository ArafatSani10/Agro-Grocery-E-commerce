import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/api";
import { useCountDown } from "../../hooks/useCountDown";
import toast from "react-hot-toast";

const TimerUnit = ({ value }) => (
  <div className="flex items-center justify-center bg-[#f24141] text-white rounded-[4px] w-[32px] h-[26px] font-bold text-[13px]">
    {value < 10 ? `0${value}` : value}
  </div>
);

const SkeletonCard = () => (
  <div className="mx-3 mb-2 bg-white rounded-lg border border-gray-100 flex h-[120px] animate-pulse">
    <div className="flex-[1.8] flex items-center p-3 gap-3">
      <div className="w-[72px] h-[72px] bg-gray-200 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <div className="h-3 w-full bg-gray-200 rounded"></div>
        <div className="flex gap-1 pt-1">
          {[1, 2, 3, 4].map((i) => <div key={i} className="w-7 h-6 bg-gray-100 rounded"></div>)}
        </div>
      </div>
    </div>
    <div className="flex-1 bg-gray-50 border-l-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-2">
      <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
      <div className="h-2 w-full bg-gray-100 mt-2 rounded"></div>
    </div>
  </div>
);

const CouponCard = ({ data }) => {
  const targetDate = new Date(data.endTime).getTime();
  const [days, hours, minutes, seconds] = useCountDown(targetDate);
  const isExpired = days + hours + minutes + seconds <= 0;
  const [copied, setCopied] = useState(false);

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied!", { id: "copy-toast", position: "top-center" });
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="mx-3 mb-2 bg-white rounded-lg border border-gray-100 shadow-sm flex h-[120px] relative overflow-hidden">
      <div className="flex-[1.8] flex items-center p-3 gap-3">
        <div className="w-[72px] h-[72px] flex-shrink-0">
          <img
            src={data.logo}
            alt=""
            className="w-full h-full object-cover rounded-lg border border-gray-50 shadow-sm"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#f24141] text-lg font-bold">
              {data.discountPercentage}% <span className="text-[10px] font-medium text-gray-500 italic">Off</span>
            </span>
            <span className={`text-[9px] px-2 py-[2px] rounded-full font-medium ${
              isExpired ? "bg-red-50 text-red-400" : "bg-[#ffe4e4] text-[#f24141]"
            }`}>
              {isExpired ? "Inactive" : "Active"}
            </span>
          </div>
          <h3 className="text-[13px] font-bold text-slate-700 truncate mb-1">
            {data.title}
          </h3>
          <div className="flex items-center gap-[4px]">
            <TimerUnit value={days} />
            <span className="font-bold text-gray-400">:</span>
            <TimerUnit value={hours} />
            <span className="font-bold text-gray-400">:</span>
            <TimerUnit value={minutes} />
            <span className="font-bold text-gray-400">:</span>
            <TimerUnit value={seconds} />
          </div>
        </div>
      </div>
      <div className="absolute right-[33.3%] -top-2 w-4 h-4 bg-white rounded-full border border-gray-100 z-10 shadow-inner"></div>
      <div className="absolute right-[33.3%] -bottom-2 w-4 h-4 bg-white rounded-full border border-gray-100 z-10 shadow-inner"></div>
      <div className="flex-1 bg-white border-l-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-2 text-center">
        <button
          onClick={() => copyCode(data.couponCode)}
          className={`w-full py-1.5 rounded-lg border-2 border-dashed font-bold text-[12px] transition-all
          ${copied
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "border-[#10b98133] bg-[#f0fdf4] text-[#10b981]"
          }`}
        >
          {copied ? "COPIED" : data.couponCode}
        </button>
        <p className="text-[8px] text-gray-400 mt-2 leading-tight font-medium">
          * This coupon apply when shopping more then <span className="font-bold text-gray-600">${data.minimumAmount || 0}</span>
        </p>
      </div>
    </div>
  );
};

export default function LatestDiscountCouponCode() {
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["homepage-active-coupons"],
    queryFn: async () => {
      const res = await api.get("/coupons");
      const allData = res.data?.data || res.data || [];
      return allData.slice(0, 2);
    },
  });

  return (
    <div className="w-full h-full flex flex-col bg-white border border-orange-100 rounded-lg overflow-hidden shadow-sm">
      <div className="px-3 py-2 bg-[#fff4e3] border-b border-orange-50">
        <h2 className="text-[14px] font-semibold text-slate-800 text-center">
          Latest Super Discount Active Coupon Code
        </h2>
      </div>
      <div className="flex-1 py-2 bg-gray-50/30 flex flex-col justify-center">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <AnimatePresence>
            {coupons.length > 0 ? (
              coupons.map((item) => (
                <CouponCard key={item._id || item.id} data={item} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 opacity-50">
                 <p className="text-sm font-bold">No Coupon Found</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
      <div className="py-2 flex justify-center bg-white -mt-2">
        <Link
          to="/offer"
          className="text-sm font-bold text-slate-500 hover:text-emerald-500 transition-colors "
        >
          Explore All Offers
        </Link>
      </div>
    </div>
  );
}