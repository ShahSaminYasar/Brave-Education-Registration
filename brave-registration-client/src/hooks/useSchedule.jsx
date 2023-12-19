import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useSchedule = (course, date) => {
  const axios = useAxios();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getSchedule", course, date],
    queryFn: () => axios.get(`/schedule?course=${course}&date=${date}`),
  });

  if (isLoading) return { isLoading: true };
  if (isError) return { error };

  return data?.data;
};
export default useSchedule;
