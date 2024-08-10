import React, { useEffect, useRef, useState } from "react";
import { useBibleBooks, useBibleVerse } from "~/utils/bibleApi";
import { Input } from "../ui/input";
import { SimpleSelect } from "../SimpleSelect";
import { Label } from "../ui/label";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import { text } from "stream/consumers";
import useClickOutside from "~/utils/useClickOutside";

interface BibleContentProps {
  books: Book[];
}

const BookContent = ({
  book,
  setBook,
  books,
}: {
  book: Book;
  books: Book[];
  setBook: React.Dispatch<React.SetStateAction<Book | undefined>>;
}) => {
  const [chapter, setChapter] = useState<number>(1);
  const bibleContainerRef = useRef<HTMLDivElement>(null);
  const [selectedVerse, setSelectedVerse] = useState<number>();
  const { data: verseData, isLoading } = useBibleVerse({
    book,
    chapter,
    version: "nvi",
  });

  useClickOutside(bibleContainerRef, () => setSelectedVerse(undefined));
  const handleSelect = () => {
    const selected = window?.getSelection();
    if (!selected) return;
    console.log("selected", selected?.toString());
    const currentVerse = verseData?.verses.find((verse) =>
      verse.text.includes(selected?.toString()),
    );
    setSelectedVerse(currentVerse?.number ? currentVerse?.number : undefined);
  };

  console.log("verseData", selectedVerse, verseData);
  return (
    <div className="mx-auto h-[800px] max-w-3xl overflow-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold uppercase">
          {book.name} {chapter}
        </h1>
      </div>

      {/* <Popover>
        <PopoverAnchor virtualRef={textSelectionRef.current} />
        <PopoverContent>Place content for the popover here.</PopoverContent>
      </Popover> */}
      <div className="my-4">
        <Label>Mudar de livro</Label>
        <SimpleSelect
          options={books.map((book) => ({
            label: book.name,
            value: book.abbrev.pt,
          }))}
          onChange={(value) =>
            setBook(books.find((b) => b.abbrev.pt === value))
          }
          value={book.abbrev.pt}
        />
      </div>
      <div className="mb-4">
        <Label>Mudar de capítulo</Label>
        <SimpleSelect
          options={Array.from({ length: book.chapters }, (_, i) => i + 1).map(
            (chap) => ({
              label: chap.toString(),
              value: chap.toString(),
            }),
          )}
          onChange={(value) => setChapter(Number(value))}
          value={chapter.toString()}
        />
      </div>
      <div
        className="space-y-6"
        onMouseUp={handleSelect}
        ref={bibleContainerRef}
      >
        {verseData?.verses.map((verse) => (
          <div
            key={verse.number}
            id={`selectBibleVerse-${verse.number}`}
            className="flex items-start space-x-3"
          >
            {selectedVerse && selectedVerse === verse.number ? (
              <Popover open>
                <PopoverAnchor>
                  <span className="text-xl font-bold text-gray-700">
                    {verse.number}
                  </span>
                </PopoverAnchor>
                <PopoverContent>
                  <p>{verse.text}</p>
                </PopoverContent>
              </Popover>
            ) : (
              <span className="text-xl font-bold text-gray-700">
                {verse.number}
              </span>
            )}
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
  const [bookSearch, setBookSearch] = useState<string>("");
  if (book) {
    return <BookContent setBook={setBook} book={book} books={books} />;
  }
  return (
    <div className="h-[800px] space-y-2 overflow-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Livros da biblia</h1>
      <div className="">
        <p>Buscar por nome ou sigla:</p>
        <Input
          value={bookSearch}
          onChange={(e) => setBookSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books
          .filter(
            (book) =>
              book.name.toLowerCase().includes(bookSearch.toLowerCase()) ||
              book.abbrev.pt.includes(bookSearch.toLowerCase()),
          )
          .map((book) => (
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
