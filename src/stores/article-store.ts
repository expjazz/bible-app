import { createStore } from 'zustand/vanilla'
import type {
  Descendant,
} from "slate";
import { getLocalArticle } from '~/lib/utils';
export type ArticleState = {
  article: Descendant[],
  title: string,
}

export type ArticleActions = {
  setArticle: (article: Descendant[]) => void
  setTitle: (title: string) => void
}

export type ArticleStore = ArticleState & ArticleActions

const { title } = getLocalArticle();
export const initArticleStore = (): ArticleState => {
  return { article: [], title: title ?? "" }
}

export const defaultInitState: ArticleState = {
  article: [],
  title: "",
}

export const createArticleStore = (
  initState: ArticleState = defaultInitState,
) => {
  return createStore<ArticleStore>()((set) => ({
    ...initState,
    setArticle: (article: Descendant[]) => set({ article }),
    setTitle: (title: string) => set({ title }),
  }))
}

