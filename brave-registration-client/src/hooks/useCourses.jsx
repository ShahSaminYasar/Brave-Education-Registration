import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useCourses = (id) => {
  const axios = useAxios();

  let url = "/courses";
  if (id) {
    url = `/courses?id=${id}`;
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getCourses", id],
    queryFn: () => axios.get(url),
  });

  if (isLoading) return { isLoading: true };
  if (isError) return { error: error };
  return data?.data;
};
export default useCourses;
