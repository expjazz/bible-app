import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import React from "react";
import { useSession } from "next-auth/react";
import { Paragraph } from "./ui/typography";
import { Button } from "./ui/button";
import { useArticleStore } from "~/stores/article-store-provider";

const SaveDialog: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  const { data: session, status } = useSession();
  const { article, title } = useArticleStore((store) => store);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salvar</DialogTitle>
        </DialogHeader>
        <section>
          {status !== "authenticated" ? (
            <div>
              <Paragraph>
                Para salvar seu estudo no banco de dados, você precisa estar
                logado. Por enquanto, seu estudo será salvo em seu navegador.
              </Paragraph>
              <Button
                onClick={() => {
                  localStorage.setItem("article", JSON.stringify(article));
                  localStorage.setItem("title", title);
                  setOpen(false);
                }}
              >
                Salvar
              </Button>
            </div>
          ) : null}
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDialog;
