import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";

export const metadata = {
  title: "내 감정일기",
  description: "감정일기와 AI 챗봇 정서지원 서비스",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
