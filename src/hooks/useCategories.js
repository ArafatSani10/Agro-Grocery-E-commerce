import { useQuery } from '@tanstack/react-query';
import api from '../lib/api'; // make sure api is exported correctly

const fetchCategories = async () => {
  const response = await api.get("/categories");
  return response.data || [];
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};