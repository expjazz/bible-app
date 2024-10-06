import { type ClassValue, clsx } from "clsx"
import { Descendant } from "slate";
import { twMerge } from "tailwind-merge"
import { slateToHtml } from "@slate-serializers/html";
import jsPDF from "jspdf";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getLocalArticle()
{
  if (typeof window === "undefined") {
    return { article: undefined, title: undefined };
  }
  const article = localStorage.getItem("article");
  const title = localStorage.getItem("title");
  return { article: article ? (JSON.parse(article) as Descendant[]) : undefined, title };
}

export async function convertArticleToPdf(article: Descendant[])
{
  return new Promise((resolve, reject) =>
  {
    const htmlContent = slateToHtml(article);
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    });
   void doc.html(htmlContent, {
      callback: function (doc) {
       const pdfDataUri = doc.output("datauristring");
      if (!pdfDataUri) reject(null)
       const element = document.createElement("iframe")
        element.innerHTML = `<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`
        resolve(element)
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
  });
}
