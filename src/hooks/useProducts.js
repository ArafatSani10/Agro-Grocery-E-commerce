import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

const fetchProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};