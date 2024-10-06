import { type ClassValue, clsx } from "clsx"
import { Descendant } from "slate";
import { twMerge } from "tailwind-merge"

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

