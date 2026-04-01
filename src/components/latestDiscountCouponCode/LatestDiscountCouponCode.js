import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/api";
import { useCountDown } from "../../hooks/useCountDown";
import toast from "react-hot-toast";

const TimerUnit = ({ value, label }) => (
  <div className="flex flex-col items-center bg-slate-900 text-white rounded-md px-2 py-1 min-w-[38px] shadow-sm">
    <span className="text-[11px] font-bold leading-none">
      {value < 10 ? `0${value}` : value}
    </span>
    <span className="text-[7px] uppercase font-medium mt-0.5 text-slate-400">{label}</span>
  </div>
);

const CouponSkeleton = () => (
  <div className="mx-4 mb-4 h-24 bg-white rounded-xl border border-slate-100 animate-pulse flex items-center p-3">
    <div className="w-14 h-14 bg-slate-200 rounded-lg"></div>
    <div className="ml-3 flex-1 space-y-2">
      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
      <div className="h-6 bg-slate-100 rounded w-full"></div>
    </div>
  </div>
);

const CouponCard = ({ data }) => {
  const targetDate = new Date(data.endTime).getTime();
  const [days, hours, minutes, seconds] = useCountDown(targetDate);
  const isExpired = (days + hours + minutes + seconds) <= 0;

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!", { id: "copy-toast" });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-4 mb-4 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:border-emerald-400 transition-colors duration-300"
    >
      <div className="flex items-stretch min-h-[90px]">
        {/* কুপন ইনফো */}
        <div className="flex-1 p-3 flex items-center">
          <div className="w-14 h-14 flex-shrink-0 bg-slate-50 rounded-lg p-1 border border-slate-100">
            <img src={data.logo} alt="" className="w-full h-full object-contain" />
          </div>

          <div className="ml-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-red-500 font-black text-lg leading-none">{data.discountPercentage}%</span>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded tracking-tighter ${isExpired ? 'bg-red-50 text-red-400' : 'bg-emerald-50 text-emerald-500'}`}>
                {isExpired ? 'EXPIRED' : 'ACTIVE'}
              </span>
            </div>
            <h4 className="text-[11px] font-bold text-slate-700 truncate">{data.title}</h4>

            {!isExpired && (
              <div className="flex gap-1 mt-1.5 items-center">
                <TimerUnit value={days} label="d" />
                <TimerUnit value={hours} label="h" />
                <TimerUnit value={minutes} label="m" />
                <TimerUnit value={seconds} label="s" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50/50 border-l border-dashed border-slate-200 w-24 flex flex-col items-center justify-center p-2 relative">
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-slate-100 rounded-full"></div>
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-slate-100 rounded-full"></div>

          <button
            onClick={() => copyCode(data.couponCode)}
            className="w-full py-1.5 bg-slate-900 text-white rounded text-[10px] font-bold tracking-tight hover:bg-emerald-600 transition-all active:scale-90"
          >
            {data.couponCode}
          </button>
          <p className="text-[8px] text-slate-400 mt-2 font-bold uppercase tracking-tighter text-center">
            Min: ${data.minimumAmount || 0}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function LatestDiscountCouponCode() {
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["homepage-active-coupons"],
    queryFn: async () => {
      const res = await api.get("/coupons");
      const allData = res.data?.data || res.data || [];
      return allData.slice(0, 2);
    }
  });

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 border-2 border-orange-500 rounded-lg shadow-sm transition-all duration-300 group hover:border-emerald-500 overflow-hidden">
      {/* হেডার */}
      <div className="bg-orange-100 text-gray-900 px-4 py-3 border-b border-orange-200 flex items-center justify-center">
        <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          Super Discount Coupons
        </h3>
      </div>

      <div className="flex-1 py-4 flex flex-col justify-start">
        {isLoading ? (
          <>
            <CouponSkeleton />
            <CouponSkeleton />
          </>
        ) : (
          <AnimatePresence mode="popLayout">
            {coupons.length > 0 ? (
              coupons.map((item) => <CouponCard key={item.id} data={item} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-40">
                <p className="text-xs font-bold uppercase">No Coupons Available</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      <Link
        to="/offers"
        className="bg-white border-t border-slate-100 py-3 text-center text-[10px] font-black text-slate-400 hover:text-emerald-500 transition-all uppercase tracking-[0.2em]"
      >
        Explore All Offers
      </Link>
    </div>
  );
}