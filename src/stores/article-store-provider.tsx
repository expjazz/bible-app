"use client";

import React, {
  type ReactNode,
  createContext,
  useRef,
  useContext,
} from "react";
import { useStore } from "zustand";
import {
  ArticleStore,
  createArticleStore,
  initArticleStore,
} from "./article-store";

export type ArticleStoreApi = ReturnType<typeof createArticleStore>;

export const ArticleStoreContext = createContext<ArticleStoreApi | undefined>(
  undefined,
);

export interface ArticleStoreProviderProps {
  children: ReactNode;
}

export const ArticleStoreProvider = ({
  children,
}: ArticleStoreProviderProps) => {
  const storeRef = useRef<ArticleStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createArticleStore(initArticleStore());
  }

  return (
    <ArticleStoreContext.Provider value={storeRef.current}>
      {children}
    </ArticleStoreContext.Provider>
  );
};

export const useArticleStore = <T,>(
  selector: (store: ArticleStore) => T,
): T => {
  const articleStoreContext = useContext(ArticleStoreContext);

  if (!articleStoreContext) {
    throw new Error(`useArticleStore must be used within ArticleStoreProvider`);
  }
  return useStore(articleStoreContext, selector);
};
