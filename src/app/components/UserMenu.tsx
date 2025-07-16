"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { useAuth } from "../../lib/auth";

const UserContainer = styled.div`
  position: fixed;
  top: 1.2rem;
  right: 2rem;
  z-index: 2100;
`;

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <UserContainer>
      <span>{user.email}</span>
      <button onClick={signOut} style={{ marginLeft: 8 }}>로그아웃</button>
    </UserContainer>
  );
}