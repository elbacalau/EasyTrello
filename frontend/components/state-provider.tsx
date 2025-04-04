'use client';

import { store } from "@/store/store";
import { Provider } from "react-redux";
import Notifications from "./Notifications";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Notifications />
    </Provider>
  );
}

export default Providers;