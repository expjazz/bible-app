import React, { useState } from "react";
import { useBibleBooks } from "~/utils/bibleApi";

interface BibleContentProps {
  books: Book[];
}

const BibleContent = ({ books }: BibleContentProps) => {
  console.log("books", books);
  const [book, setBook] = useState<Book | undefined>();
  if (book) {
    return <div className="">reading {book.name}</div>;
  }
  return (
    <div className="h-[800px] overflow-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Livros da biblia</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <button
            key={book.abbrev.en}
            onClick={() => setBook(book)}
            className="rounded-lg bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">{book.name}</h2>
            <p className="text-gray-600">{book.author}</p>
            <p className="text-gray-600">Chapters: {book.chapters}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
const Bible = () => {
  const { data: booksData, isLoading } = useBibleBooks();
  if (isLoading || !booksData) {
    return <div>Loading...</div>;
  }
  return <BibleContent books={booksData} />;
};

export default Bible;
