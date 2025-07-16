"use client";

import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";
import UserMenu from "./components/UserMenu";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <UserMenu />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
