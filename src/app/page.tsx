"use client";
import Link from "next/link";
import styled from "@emotion/styled";

const Main = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f7f8fa;
`;
const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
`;
const Desc = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2.5rem;
  text-align: center;
  max-width: 350px;
`;
const Button = styled.button`
  background: #6c63ff;
  color: #fff;
  font-size: 1.1rem;
  padding: 0.9rem 2.2rem;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.08);
  transition: background 0.2s;
  &:hover {
    background: #554ee0;
  }
`;

export default function Home() {
  return (
    <Main>
      <Title>내 감정일기</Title>
      <Desc>
        감정을 자유롭게 기록하고, AI 챗봇과 대화하며 마음을 돌보는 정서지원 플랫폼
      </Desc>
      <Link href="/write">
        <Button>오늘의 감정일기 작성</Button>
      </Link>
    </Main>
  );
}
