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

const SaveDialog: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  const { data: session, status } = useSession();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salvar</DialogTitle>
        </DialogHeader>
        <section>
          {status === "authenticated" ? (
            <div>
              <Paragraph>
                Para salvar seu estudo, você precisa estar logado.
              </Paragraph>
            </div>
          ) : null}
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDialog;
