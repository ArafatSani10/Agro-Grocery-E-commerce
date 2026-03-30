import { useQuery } from '@tanstack/react-query';
import api from '../lib/api'; // make sure api is exported correctly

const fetchCategories = async () => {
  const startTime = performance.now();
  console.log("Categories fetch start:", startTime.toFixed(2), "ms");

  const response = await api.get('/categories'); // axios
  const endTime = performance.now();
  console.log("Categories fetch end:", endTime.toFixed(2), "ms");
  console.log("Categories fetch took:", (endTime - startTime).toFixed(2), "ms");

  return response.data; // important
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};