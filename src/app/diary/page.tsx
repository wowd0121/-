"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";

const ListWrap = styled.main`
  min-height: 100vh;
  background: #f7f8fa;
  padding: 2.5rem 0 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;
const DiaryList = styled.ul`
  list-style: none;
  padding: 0;
  width: 350px;
  max-width: 95vw;
`;
const DiaryItem = styled.li`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.07);
  margin-bottom: 1.1rem;
  padding: 1.1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const DiaryLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;
const Tag = styled.span`
  font-size: 1.1rem;
  margin-right: 0.5rem;
`;
const DateText = styled.span`
  color: #888;
  font-size: 0.95rem;
`;

export default function DiaryPage() {
  const [diaries, setDiaries] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("diaries") || "[]");
    setDiaries(data);
  }, []);

  return (
    <ListWrap>
      <Title>감정일기 목록</Title>
      <DiaryList>
        {diaries.length === 0 && <div>작성된 일기가 없습니다.</div>}
        {diaries.map((d) => (
          <DiaryItem key={d.id}>
            <DiaryLink href={`/diary/${d.id}`}>
              <div>
                <Tag>{d.tag.emoji} {d.tag.label}</Tag>
                <DateText>{new Date(d.date).toLocaleString()}</DateText>
              </div>
              <div style={{ marginTop: 6, color: "#333", fontSize: "1.05rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {d.text}
              </div>
            </DiaryLink>
          </DiaryItem>
        ))}
      </DiaryList>
    </ListWrap>
  );
} 