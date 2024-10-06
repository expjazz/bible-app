import React, { useRef, useState } from "react";
import { trpc } from "~/server/trpc/client";
import { Input } from "../ui/input";
import { SimpleSelect } from "../SimpleSelect";
import { Label } from "../ui/label";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import useClickOutside from "~/utils/useClickOutside";
import { MdClose, MdSearch } from "react-icons/md";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Paragraph } from "../ui/typography";

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
  const { data: verseData, isLoading } = trpc.bibleVerse.useQuery({
    book,
    chapter,
    version: "nvi",
  });

  useClickOutside(bibleContainerRef, () => setSelectedVerse(undefined));

  const handleSelect = () => {
    const selected = window?.getSelection();
    if (!selected) return;
    const currentVerse = verseData?.verses.find((verse) =>
      verse.text.includes(selected?.toString()),
    );
    setSelectedVerse(currentVerse?.number ? currentVerse?.number : undefined);
  };

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center text-4xl font-bold text-primary">
          {book.name} - Capítulo {chapter}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <Label className="text-lg font-semibold">Livro</Label>
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
          <div>
            <Label className="text-lg font-semibold">Capítulo</Label>
            <SimpleSelect
              options={Array.from(
                { length: book.chapters },
                (_, i) => i + 1,
              ).map((chap) => ({
                label: chap.toString(),
                value: chap.toString(),
              }))}
              onChange={(value) => setChapter(Number(value))}
              value={chapter.toString()}
            />
          </div>
        </div>
        <ScrollArea className="h-[600px] pr-4">
          <div
            className="space-y-4"
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
                      <span className="text-2xl font-bold text-primary">
                        {verse.number}
                      </span>
                    </PopoverAnchor>
                    <PopoverContent>
                      <Card>
                        <CardContent className="p-4">
                          <Paragraph>{verse.text}</Paragraph>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedVerse(undefined)}
                            className="mt-2"
                          >
                            <MdClose className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {verse.number}
                  </span>
                )}
                <Paragraph>{verse.text}</Paragraph>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-6 flex justify-between">
          <Button
            onClick={() => setChapter(chapter - 1)}
            disabled={chapter <= 1}
            variant="outline"
          >
            Capítulo Anterior
          </Button>
          <Button
            onClick={() => setChapter(chapter + 1)}
            disabled={chapter >= book.chapters}
          >
            Próximo Capítulo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const BibleContent = ({ books }: BibleContentProps) => {
  const [book, setBook] = useState<Book | undefined>();
  const [bookSearch, setBookSearch] = useState<string>("");

  if (book) {
    return <BookContent setBook={setBook} book={book} books={books} />;
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center text-4xl font-bold text-primary">
          Livros da Bíblia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label className="text-lg font-semibold">
            Buscar por nome ou sigla
          </Label>
          <div className="relative">
            <Input
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              className="pl-10"
              placeholder="Digite o nome ou sigla do livro..."
            />
            <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {books
              .filter(
                (book) =>
                  book.name.toLowerCase().includes(bookSearch.toLowerCase()) ||
                  book.abbrev.pt.includes(bookSearch.toLowerCase()),
              )
              .map((book) => (
                <Button
                  key={book.abbrev.en}
                  onClick={() => setBook(book)}
                  variant="outline"
                  className="h-auto flex-col items-start p-4 text-left"
                >
                  <span className="text-lg font-semibold text-primary">
                    {book.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {book.author}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Capítulos: {book.chapters}
                  </span>
                </Button>
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const Bible = () => {
  const { data: booksData, isLoading } = trpc.bibleBooks.useQuery();

  if (isLoading || !booksData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-2xl font-semibold text-primary">
          Carregando...
        </span>
      </div>
    );
  }

  return <BibleContent books={booksData} />;
};

export default Bible;
