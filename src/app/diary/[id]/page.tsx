"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "@emotion/styled";

const DetailWrap = styled.main`
  min-height: 100vh;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3rem;
`;
const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
`;
const Tag = styled.span`
  font-size: 1.2rem;
  margin-right: 0.7rem;
`;
const DateText = styled.span`
  color: #888;
  font-size: 1rem;
`;
const Text = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.07);
  padding: 1.5rem 1.2rem;
  margin-top: 1.2rem;
  width: 350px;
  max-width: 95vw;
  color: #333;
  font-size: 1.08rem;
  line-height: 1.7;
`;
const BackBtn = styled.button`
  margin-top: 2.5rem;
  background: #ecebff;
  color: #6c63ff;
  border: none;
  border-radius: 1.5rem;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
`;
const ChatBtn = styled.button`
  margin-top: 1.2rem;
  background: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  padding: 0.7rem 1.7rem;
  font-size: 1.05rem;
  cursor: pointer;
  margin-right: 1rem;
`;

export default function DiaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [diary, setDiary] = useState<any | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("diaries") || "[]");
    const found = data.find((d: any) => d.id === params.id);
    setDiary(found || null);
  }, [params.id]);

  if (!diary) {
    return (
      <DetailWrap>
        <Title>일기 상세</Title>
        <div>일기를 찾을 수 없습니다.</div>
        <BackBtn onClick={() => router.push("/diary")}>목록으로</BackBtn>
      </DetailWrap>
    );
  }

  return (
    <DetailWrap>
      <Title>일기 상세</Title>
      <div>
        <Tag>{diary.tag.emoji} {diary.tag.label}</Tag>
        <DateText>{new Date(diary.date).toLocaleString()}</DateText>
      </div>
      <Text>{diary.text}</Text>
      <div>
        <ChatBtn onClick={() => router.push(`/chat/${diary.id}`)}>
          AI 챗봇과 대화하기
        </ChatBtn>
        <BackBtn onClick={() => router.push("/diary")}>목록으로</BackBtn>
      </div>
    </DetailWrap>
  );
} 