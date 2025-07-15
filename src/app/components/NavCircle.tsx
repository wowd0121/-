"use client";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";

const NavWrap = styled.nav`
  position: fixed;
  bottom: 2.2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  z-index: 100;
`;
const CircleBtn = styled.button<{ color?: string }>`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: ${({ color }) => color || "#fff"};
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.13);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #6c63ff;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  &:hover {
    background: #ecebff;
    color: #554ee0;
  }
`;

export default function NavCircle() {
  const router = useRouter();
  return (
    <NavWrap>
      <CircleBtn aria-label="뒤로가기" onClick={() => router.back()}>
        ←
      </CircleBtn>
      <CircleBtn aria-label="홈" onClick={() => router.push("/")}
        color="#f7f8fa">
        🏠
      </CircleBtn>
      <CircleBtn aria-label="일기 작성" onClick={() => router.push("/write")}
        color="#f7f8fa">
        ✏️
      </CircleBtn>
      <CircleBtn aria-label="일기 목록" onClick={() => router.push("/diary")}
        color="#f7f8fa">
        📋
      </CircleBtn>
      <CircleBtn aria-label="앞으로가기" onClick={() => router.forward()}>
        →
      </CircleBtn>
    </NavWrap>
  );
} 