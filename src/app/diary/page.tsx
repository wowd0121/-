"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { useAuth } from "@/lib/auth";
import { getDiaries, Diary } from "@/lib/diary";

const ListWrap = styled.main`
  min-height: 100vh;
  background: #f7f8fa;
  padding: 5rem 0 1.5rem 0;
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
const LoadingText = styled.div`
  color: #666;
  font-size: 1rem;
  text-align: center;
`;
const ErrorText = styled.div`
  color: #ff4444;
  font-size: 1rem;
  text-align: center;
`;
const AddButton = styled.button`
  background: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.2s;

  &:hover {
    background: #5a52d4;
  }
`;

export default function DiaryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiaries = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getDiaries(user.id);
        setDiaries(data);
      } catch (err) {
        setError('일기 목록을 불러오는 중 오류가 발생했습니다.');
        console.error('일기 목록 조회 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchDiaries();
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <ListWrap>
        <LoadingText>로딩 중...</LoadingText>
      </ListWrap>
    );
  }

  if (!user) {
    return (
      <ListWrap>
        <Title>감정일기 목록</Title>
        <div style={{ textAlign: 'center', color: '#666' }}>
          로그인이 필요합니다.
        </div>
      </ListWrap>
    );
  }

  return (
    <ListWrap>
      <Title>감정일기 목록</Title>
      <AddButton onClick={() => router.push('/write')}>
        새 일기 작성
      </AddButton>
      <DiaryList>
        {loading && <LoadingText>일기를 불러오는 중...</LoadingText>}
        {error && <ErrorText>{error}</ErrorText>}
        {!loading && !error && diaries.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666' }}>
            작성된 일기가 없습니다.
          </div>
        )}
        {diaries.map((diary) => (
          <DiaryItem key={diary.id}>
            <DiaryLink href={`/diary/${diary.id}`}>
              <div>
                <Tag>{diary.emoji} {diary.emotion}</Tag>
                <DateText>{new Date(diary.created_at).toLocaleString()}</DateText>
              </div>
              <div style={{ marginTop: 6, color: "#333", fontSize: "1.05rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {diary.title || diary.content.substring(0, 50)}
              </div>
            </DiaryLink>
          </DiaryItem>
        ))}
      </DiaryList>
    </ListWrap>
  );
} 