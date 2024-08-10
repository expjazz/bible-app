import React from "react";
import { useBibleBooks } from "~/utils/bibleApi";

const Bible = () => {
  const { data: books, isLoading } = useBibleBooks();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <div>Bible logic</div>;
};

export default Bible;
