import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

const fetchProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 10, 
    gcTime: 1000 * 60 * 60,   
    refetchOnWindowFocus: false, 
    refetchOnReconnect: false,
    retry: 1, 
  });
};