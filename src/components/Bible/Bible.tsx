import React, { useState } from "react";
import { useBibleBooks, useBibleVerse } from "~/utils/bibleApi";

interface BibleContentProps {
  books: Book[];
}

const BookContent = ({ book }: { book: Book }) => {
  const [chapter, setChapter] = useState<number>(1);
  const { data: verseData, isLoading } = useBibleVerse({
    book,
    chapter,
    version: "nvi",
  });
  if (isLoading || !verseData) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  console.log("verseData", verseData);
  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold uppercase">
          {book.name} {chapter}
        </h1>
      </div>
      <div className="mb-4">
        <label htmlFor="chapter" className="block text-gray-700">
          Select Chapter:
        </label>
        <select
          id="chapter"
          value={chapter}
          onChange={(e) => setChapter(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          {Array.from({ length: book.chapters }, (_, i) => i + 1).map(
            (chap) => (
              <option key={chap} value={chap}>
                {chap}
              </option>
            ),
          )}
        </select>
      </div>
      <div className="space-y-6">
        {verseData.verses.map((verse) => (
          <div key={verse.number} className="flex items-start space-x-3">
            <span className="text-xl font-bold text-gray-700">
              {verse.number}
            </span>
            <p className="text-lg leading-relaxed">{verse.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setChapter(chapter - 1)}
          disabled={chapter <= 1}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-white disabled:bg-gray-400"
        >
          Previous Chapter
        </button>
        <button
          onClick={() => setChapter(chapter + 1)}
          disabled={chapter >= book.chapters}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-white disabled:bg-gray-400"
        >
          Next Chapter
        </button>
      </div>
    </div>
  );
};

const BibleContent = ({ books }: BibleContentProps) => {
  console.log("books", books);
  const [book, setBook] = useState<Book | undefined>();
  if (book) {
    return <BookContent book={book} />;
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
