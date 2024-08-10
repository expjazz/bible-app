import { useQuery } from "@tanstack/react-query";
import { bibleAxiosClient } from "./bibleAxiosClient";

export const getBibleBooks = async () => {
  const response = await bibleAxiosClient.get<Book[]>("/books");
  return response.data;
};

export const useBibleBooks = () =>
  {
    return useQuery({
      queryKey: ["bibleBooks"],
      queryFn: getBibleBooks,
    });

}

export type verseProps = {
  book: Book;
  chapter?: number;
  version?: string;
}

export const getVerse = async({
  book,
  chapter = 1,
  version = "nvi",
}: verseProps) =>
{
  const response = await bibleAxiosClient.get<GetChapterResponse>(`/verses/${version}/${book.abbrev.pt}/${chapter}`);
  return response.data;
}

export const useBibleVerse = ({
  book,
  chapter = 1,
  version = "nvi",
}: verseProps) => {
  return useQuery({
    queryKey: ["bibleVerse", book.abbrev.pt, chapter, version],
    queryFn: () => getVerse({ book, chapter, version }),
  });
}