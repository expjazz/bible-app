"use client";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "~/components/ui/menubar";
import { slateToHtml } from "@slate-serializers/html";
import jsPDF from "jspdf";
import copy from "copy-to-clipboard";
import ArticleDialog from "../ArticleDialog";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createArticle, createPdfTemplate, updateArticle } from "~/app/actions";
import { useArticleStore } from "~/stores/article-store-provider";
import { useSession } from "next-auth/react";
import { Prisma } from "@prisma/client";
import LoginForm from "../LoginForm";
import SignupForm from "../SignupForm";
import SaveDialog from "../SaveDialog";
import { convertArticleToPdf } from "~/lib/utils";

export function TopMenu() {
  const [openArticles, setOpenArticles] = useState(false);
  const { data: session, status } = useSession();
  const { articleId } = useParams<{ articleId?: string }>();
  const { article, title } = useArticleStore((store) => store);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const generatePdfLink = async () => {
    const html = await convertArticleToPdf(article);
    console.log("tesgting here eita", html, articleId, session?.user.id);
    if (!html || !articleId || !session?.user.id) return;
    const link = await createPdfTemplate({
      content: html as unknown as Prisma.InputJsonValue,
      articleId,
      userId: session?.user.id,
    });
    copy(`${process.env.NEXT_PUBLIC_APP_URL}/pdf/${link.id}`);
    console.log("this is an html", link);
  };
  const saveArticle = async () => {
    if (!session) {
      setOpenSaveDialog(true);
      return;
    }
    if (articleId) {
      await updateArticle({
        id: articleId,
        content: article as unknown as Prisma.InputJsonValue,
        title,
      });
    } else {
      await createArticle({
        content: article as unknown as Prisma.InputJsonValue,
        title,
        userId: session.user.id,
      });
    }
  };
  return (
    <>
      <ArticleDialog open={openArticles} setOpen={setOpenArticles} />
      <SaveDialog open={openSaveDialog} setOpen={setOpenSaveDialog} />
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Arquivos</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => setOpenArticles(true)}>
              Ver estudos
            </MenubarItem>
            <MenubarItem onClick={saveArticle}>Salvar</MenubarItem>
            <MenubarItem disabled>New Incognito Window</MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Compartilhar</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem
                  onClick={() => {
                    console.log(slateToHtml(article));
                    const htmlContent = slateToHtml(article);
                    const doc = new jsPDF({
                      unit: "pt",
                      format: "a4",
                    });
                    void doc.html(htmlContent, {
                      callback: function (doc) {
                        const pdfDataUri = doc.output("datauristring");
                        const newWindow = window.open();
                        if (newWindow) {
                          newWindow.document.write(
                            `<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`,
                          );
                        }
                      },
                      x: 40,
                      y: 40,
                      html2canvas: {
                        scale: 0.7,
                      },
                      autoPaging: "text",
                      width: 500, // Approximately A4 width in points
                      windowWidth: 800, // Adjust based on your editor's width
                    });
                  }}
                >
                  PDF
                </MenubarItem>
                <MenubarItem onClick={() => generatePdfLink()}>
                  Compartilhar Link
                </MenubarItem>
                <MenubarItem>Notes</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              Print... <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Find</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Search the web</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Find...</MenubarItem>
                <MenubarItem>Find Next</MenubarItem>
                <MenubarItem>Find Previous</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>
              Always Show Full URLs
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>
              Reload <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Hide Sidebar</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Profiles</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value="benoit">
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem inset>Edit...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Add Profile...</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        {status !== "authenticated" ? (
          <>
            <div className="w-[55%]" />
            <MenubarMenu>
              <MenubarTrigger>
                <LoginForm />
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>
                <SignupForm />
              </MenubarTrigger>
            </MenubarMenu>
          </>
        ) : null}
      </Menubar>
    </>
  );
}
