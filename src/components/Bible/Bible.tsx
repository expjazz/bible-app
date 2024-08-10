import React from "react";
import { useBibleBooks } from "~/utils/bibleApi";

interface BibleContentProps {
  books: Book[];
}

const BibleContent = ({ books }: BibleContentProps) => {
  console.log("books", books);
  return <div>{books[0]?.name}</div>;
};
const Bible = () => {
  const { data: booksData, isLoading } = useBibleBooks();
  if (isLoading || !booksData) {
    return <div>Loading...</div>;
  }
  return <BibleContent books={booksData} />;
};

export default Bible;
