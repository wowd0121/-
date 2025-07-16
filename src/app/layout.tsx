"use client";

import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";
import UserMenu from "./components/UserMenu";
import GlobalNav from "./components/GlobalNav";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <UserMenu />
          <GlobalNav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
