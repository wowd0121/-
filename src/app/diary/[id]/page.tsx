"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { useAuth } from "@/lib/auth";
import { getDiary, getAdjacentDiaries, deleteDiary, Diary } from "@/lib/diary";

const DetailWrap = styled.main`
  min-height: 100vh;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5rem;
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
const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;
const BackBtn = styled.button`
  background: #ecebff;
  color: #6c63ff;
  border: none;
  border-radius: 1.5rem;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #d8d6ff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const ChatBtn = styled.button`
  background: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  padding: 0.7rem 1.7rem;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #5a52d4;
  }
`;
const DeleteBtn = styled.button`
  background: #ff4444;
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e63939;
  }
`;
const NavigationBtn = styled.button`
  background: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 1.5rem;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e0e0e0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

export default function DiaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [adjacentDiaries, setAdjacentDiaries] = useState<{
    previous: Diary | null;
    next: Diary | null;
  }>({ previous: null, next: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiary = async () => {
      if (!user || !params?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const diaryData = await getDiary(params.id as string);
        if (!diaryData) {
          setError('일기를 찾을 수 없습니다.');
          return;
        }

        // 다른 사용자의 일기인지 확인
        if (diaryData.user_id !== user.id) {
          setError('접근 권한이 없습니다.');
          return;
        }

        setDiary(diaryData);

        // 인접 일기 조회
        const adjacent = await getAdjacentDiaries(user.id, params.id as string);
        setAdjacentDiaries(adjacent);
      } catch (err) {
        setError('일기를 불러오는 중 오류가 발생했습니다.');
        console.error('일기 상세 조회 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchDiary();
    }
  }, [user, params?.id, authLoading]);

  const handleDelete = async () => {
    if (!diary || !confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const success = await deleteDiary(diary.id);
      if (success) {
        router.push('/diary');
      } else {
        alert('일기 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('일기 삭제 오류:', err);
      alert('일기 삭제 중 오류가 발생했습니다.');
    }
  };

  if (authLoading || loading) {
    return (
      <DetailWrap>
        <LoadingText>로딩 중...</LoadingText>
      </DetailWrap>
    );
  }

  if (!user) {
    return (
      <DetailWrap>
        <Title>일기 상세</Title>
        <div style={{ textAlign: 'center', color: '#666' }}>
          로그인이 필요합니다.
        </div>
        <BackBtn onClick={() => router.push("/diary")}>목록으로</BackBtn>
      </DetailWrap>
    );
  }

  if (error || !diary) {
    return (
      <DetailWrap>
        <Title>일기 상세</Title>
        <ErrorText>{error || '일기를 찾을 수 없습니다.'}</ErrorText>
        <BackBtn onClick={() => router.push("/diary")}>목록으로</BackBtn>
      </DetailWrap>
    );
  }

  return (
    <DetailWrap>
      <Title>일기 상세</Title>
      <div>
        <Tag>{diary.emoji} {diary.emotion}</Tag>
        <DateText>{new Date(diary.created_at).toLocaleString()}</DateText>
      </div>
      <Text>
        <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
          {diary.title}
        </div>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {diary.content}
        </div>
      </Text>
      
      <ButtonGroup>
        <NavigationBtn 
          onClick={() => router.push(`/diary/${adjacentDiaries.previous?.id}`)}
          disabled={!adjacentDiaries.previous}
        >
          ← 이전 일기
        </NavigationBtn>
        <NavigationBtn 
          onClick={() => router.push(`/diary/${adjacentDiaries.next?.id}`)}
          disabled={!adjacentDiaries.next}
        >
          다음 일기 →
        </NavigationBtn>
      </ButtonGroup>

      <ButtonGroup>
        <ChatBtn onClick={() => router.push(`/chat/${diary.id}`)}>
          AI 챗봇과 대화하기
        </ChatBtn>
        <BackBtn onClick={() => router.push("/diary")}>
          목록으로
        </BackBtn>
        <BackBtn onClick={() => router.push(`/diary/${diary.id}/edit`)}>
          수정
        </BackBtn>
        <DeleteBtn onClick={handleDelete}>
          삭제
        </DeleteBtn>
      </ButtonGroup>
    </DetailWrap>
  );
} 