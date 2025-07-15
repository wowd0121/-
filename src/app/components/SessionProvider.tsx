"use client";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { ReactNode } from "react";

export default function NextAuthSessionProvider({ children, session }: { children: ReactNode; session?: Session | null }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
} 