
"use client";

import { useAuthInit } from "@/hooks/useAuthInit";
export const SessionInitializer = () => {
  useAuthInit();
  return null;
};
