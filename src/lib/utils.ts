import { type ClassValue, clsx } from "clsx"
import { Descendant } from "slate";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getLocalArticle() {
  const article = localStorage.getItem("article");
  const title = localStorage.getItem("title");
  return { article: article ? (JSON.parse(article) as Descendant[]) : undefined, title };
}

import escapeHtml from 'escape-html'
import { Text } from 'slate'

export const serialize = node => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text)
    if (node.bold) {
      string = `<strong>${string}</strong>`
    }
    return string
  }

  const children = node.children.map(n => serialize(n)).join('')

  switch (node.type) {
    case 'quote':
      return `<blockquote><p>${children}</p></blockquote>`
    case 'paragraph':
      return `<p>${children}</p>`
    case 'link':
      return `<a href="${escapeHtml(node.url)}">${children}</a>`
    default:
      return children
  }
}