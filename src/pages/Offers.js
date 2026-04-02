import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { useCountDown } from "../hooks/useCountDown";
import toast, { Toaster } from "react-hot-toast";
import offerBg from "../assets/offerBanner/Screenshot 2026-04-02 204019.png";

const CouponSkeleton = () => (
  <div className="block md:flex lg:flex md:justify-between lg:justify-between bg-white rounded-md shadow-sm animate-pulse">
    <div className="p-6 flex items-center">
      <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
      <div className="ml-5 w-full">
        <div className="h-4 w-40 bg-gray-200 mb-3 rounded"></div>
        <div className="h-5 w-28 bg-gray-200 mb-2 rounded"></div>
        <div className="h-6 w-20 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="md:border-l-2 lg:border-l-2 border-dashed lg:w-1/3 md:w-1/3 px-6 flex items-center">
      <div className="w-full">
        <div className="h-4 w-24 bg-gray-200 mb-3 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded mb-3"></div>
        <div className="h-3 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const TimeBox = ({ value, label }) => (
  <div className="flex flex-col items-center bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md px-2 py-1 min-w-[60px]">
    <span className="text-sm font-bold">
      {value < 10 ? `0${value}` : value}
    </span>
    <span className="text-[10px]">{label}</span>
  </div>
);

const ExpiredNotice = () => (
  <div className="flex gap-2 mb-2">
    <TimeBox value={0} label="Days" />
    <TimeBox value={0} label="Hours" />
    <TimeBox value={0} label="Minutes" />
    <TimeBox value={0} label="Seconds" />
  </div>
);

const ShowCounter = ({ days, hours, minutes, seconds }) => (
  <div className="flex gap-2 mb-2">
    <TimeBox value={days} label="Days" />
    <TimeBox value={hours} label="Hours" />
    <TimeBox value={minutes} label="Minutes" />
    <TimeBox value={seconds} label="Seconds" />
  </div>
);

const ShowCoupon = ({ item }) => {
  const targetDate = new Date(item.endTime).getTime();
  const [days, hours, minutes, seconds] = useCountDown(targetDate);
  const counter = days + hours + minutes + seconds;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(item.couponCode);
    setCopied(true);
    toast.success("Copied successfully!", {
      position: "top-center",
      style: {
        borderRadius: "8px",
        background: "#10b981",
        color: "#fff",
        fontSize: "14px",
        fontWeight: "bold",
      },
    });
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="block md:flex lg:flex md:justify-between lg:justify-between bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-6 flex items-center">
        <figure>
          <img
            alt={item.title}
            src={item.logo}
            className="w-20 h-20 object-cover rounded-lg"
          />
        </figure>

        <div className="ml-5">
          {counter <= 0 ? (
            <ExpiredNotice />
          ) : (
            <ShowCounter
              days={days}
              hours={hours}
              minutes={minutes}
              seconds={seconds}
            />
          )}

          <h2 className="text-lg font-medium">{item.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          <p className="font-bold text-xl text-gray-600 mt-2">
            <span className="text-red-500 font-extrabold">
              {item.discountPercentage}%
            </span>{" "}
            Off
          </p>
        </div>
      </div>

      <div className="md:border-l-2 lg:border-l-2 border-dashed lg:w-1/3 md:w-1/3 px-6 flex items-center">
        <div className="w-full">
          <div className="font-medium flex items-center mb-1">
            <span className="text-black">Coupon</span>
            <div className="ml-2">
              {counter <= 0 ? (
                <span className="text-red-600">Inactive</span>
              ) : (
                <span className="text-emerald-600">Active</span>
              )}
            </div>
          </div>

          <div className="border border-dashed bg-emerald-50 py-2 border-emerald-300 rounded-lg text-center">
            <button
              onClick={handleCopy}
              className={`w-full py-1.5 text-sm font-semibold transition-all duration-300 ${
                copied
                  ? "bg-emerald-500 text-white scale-95"
                  : "text-emerald-600 hover:bg-emerald-500 hover:text-white active:scale-95"
              }`}
            >
              {copied ? "Copied!" : item.couponCode}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            * This coupon code will apply on{" "}
            <span className="font-bold text-gray-700">{item.productType}</span>{" "}
            type products and when you shopping more then{" "}
            <span className="font-bold text-gray-700">${item.minimumAmount}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const Offers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["all-coupons"],
    queryFn: async () => {
      const res = await api.get("/coupons");
      return res.data?.data || res.data || [];
    },
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster />

      <div
        className="relative flex justify-center items-center py-16 lg:py-24 w-full bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `url('${offerBg}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <h2 className="relative z-10 text-2xl md:text-4xl lg:text-5xl font-bold text-white px-8 py-3 rounded-lg backdrop-blur-md bg-white/10 border border-white/20">
          Mega Offer
        </h2>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:py-20 sm:px-10">
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CouponSkeleton key={i} />)
            : coupons.map((item) => <ShowCoupon key={item._id || item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
};

export default Offers;