"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";

let store: AppStore | undefined;

function getStore() {
  if (typeof window === "undefined") {
    return makeStore();
  }
  if (!store) {
    store = makeStore();
  }
  return store;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStore, setCurrentStore] = useState<AppStore | null>(null);

  useEffect(() => {
    setCurrentStore(getStore());
  }, []);

  if (!currentStore) {
    return null;
  }

  return <Provider store={currentStore}>{children}</Provider>;
}
