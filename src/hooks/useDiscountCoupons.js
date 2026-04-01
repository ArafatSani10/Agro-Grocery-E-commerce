import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export const useDiscountCoupons = () => {
  return useQuery({
    queryKey: ["discount-coupons"],
    queryFn: async () => {
      const res = await api.get("/coupons");
      return res.data?.data || res.data || [];
    },
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10,   
    refetchOnWindowFocus: false, 
  });
};