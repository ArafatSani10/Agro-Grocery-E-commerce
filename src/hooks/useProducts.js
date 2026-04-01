import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

const fetchProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const useProducts = (params = {}) => {
  const category = params.category || null;
  const q = params.q || null;

  return useQuery({
    queryKey: ["products", category, q],
    queryFn: () => fetchProducts(params),
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 30,   
    refetchOnWindowFocus: false,
    retry: 1,
  });
};