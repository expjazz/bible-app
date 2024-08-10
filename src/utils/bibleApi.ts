import { useQuery } from "@tanstack/react-query";
import { bibleAxiosClient } from "./bibleAxiosClient";

export const getBibleBooks = async () => {
  const response = await bibleAxiosClient.get<Book[]>("/books");
  return response;
};

export const useBibleBooks = () =>
  {
    return useQuery({
      queryKey: ["bibleBooks"],
      queryFn: getBibleBooks,
    });

  }