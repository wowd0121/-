"use client";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getDiaries } from "@/lib/diary";

const NavRow = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  background: #fff;
  padding: 1rem 0 0.5rem 0;
  z-index: 2000;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.07);
`;
const NavBtn = styled.button`
  background: #ecebff;
  color: #6c63ff;
  border: none;
  border-radius: 1.5rem;
  padding: 0.6rem 1.3rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  &:hover {
    background: #d8d6ff;
    color: #554ee0;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function GlobalNav() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [latestId, setLatestId] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      if (!user) return;
      setFetching(true);
      const diaries = await getDiaries(user.id);
      setLatestId(diaries.length > 0 ? diaries[0].id : null);
      setFetching(false);
    };
    if (user) fetchLatest();
  }, [user]);

  return (
    <NavRow>
      <NavBtn onClick={() => router.push("/")}>홈</NavBtn>
      <NavBtn onClick={() => router.push("/diary")}>일기 목록</NavBtn>
      <NavBtn onClick={() => router.push("/write")}>일기 작성</NavBtn>
    </NavRow>
  );
} 