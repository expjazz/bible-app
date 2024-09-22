"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { trpc } from "~/server/trpc/client";
const ArticleDialog: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  console.log("inside modal");
  const { data: session } = useSession();
  const { data: articles } = trpc.getArticles.useQuery({
    userId: session?.user?.id ?? "",
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Estudos</DialogTitle>
        </DialogHeader>
        <section>
          {articles?.map((article) => (
            <Link key={article.id} href={`/${article.id}`}>
              <button onClick={() => setOpen(false)}>
                <div className="flex flex-col">
                  <h3>{article.title}</h3>
                </div>
              </button>
            </Link>
          ))}
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleDialog;
