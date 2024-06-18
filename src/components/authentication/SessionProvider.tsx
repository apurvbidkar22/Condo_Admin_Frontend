"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

export const AuthProvider = ({ children }: any) => {
  return <SessionProvider>{children}</SessionProvider>;
};
