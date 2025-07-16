"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { useAuth } from "@/lib/auth";
import { getDiary, updateDiary, Diary } from "@/lib/diary";

const EMOTION_TAGS = [
  { label: "기쁨", emoji: "😊" },
  { label: "분노", emoji: "😡" },
  { label: "불안", emoji: "😰" },
  { label: "슬픔", emoji: "😢" },
  { label: "평온", emoji: "😌" },
  { label: "놀람", emoji: "😲" },
];

const Main = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #f7f8fa;
  padding-top: 3rem;
`;
const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
`;
const TitleInput = styled.input`
  width: 320px;
  border: 1.5px solid #d1d5db;
  border-radius: 1rem;
  padding: 1rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  background: #fff;
`;
const Textarea = styled.textarea`
  width: 320px;
  height: 120px;
  border: 1.5px solid #d1d5db;
  border-radius: 1rem;
  padding: 1rem;
  font-size: 1rem;
  resize: none;
  margin-bottom: 1.5rem;
  background: #fff;
`;
const TagList = styled.div`
  display: flex;
  gap: 0.7rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;
const TagButton = styled.button<{ selected: boolean }>`
  background: ${({ selected }) => (selected ? "#6c63ff" : "#fff")};
  color: ${({ selected }) => (selected ? "#fff" : "#333")};
  border: 1.5px solid #d1d5db;
  border-radius: 1.5rem;
  padding: 0.5rem 1.1rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
  outline: none;
  &:hover {
    background: #ecebff;
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;
const SaveButton = styled.button<{ disabled: boolean }>`
  background: #6c63ff;
  color: #fff;
  font-size: 1.1rem;
  padding: 0.7rem 2.2rem;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.08);
  transition: background 0.2s;
  &:hover {
    background: #554ee0;
  }
`;
const CancelButton = styled.button`
  background: #f0f0f0;
  color: #333;
  font-size: 1.1rem;
  padding: 0.7rem 2.2rem;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #e0e0e0;
  }
`;
const SavedMsg = styled.div`
  margin-top: 1.2rem;
  color: #6c63ff;
  font-weight: bold;
`;
const ErrorMsg = styled.div`
  margin-top: 1.2rem;
  color: #ff4444;
  font-weight: bold;
`;
const LoadingText = styled.div`
  color: #666;
  font-size: 1rem;
  text-align: center;
`;

export default function EditDiaryPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setTitle(diaryData.title);
        setContent(diaryData.content);
        
        // 현재 감정 태그 찾기
        const emotionIndex = EMOTION_TAGS.findIndex(tag => tag.label === diaryData.emotion);
        setSelected(emotionIndex !== -1 ? emotionIndex : null);
      } catch (err) {
        setError('일기를 불러오는 중 오류가 발생했습니다.');
        console.error('일기 조회 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchDiary();
    }
  }, [user, params?.id, authLoading]);

  const handleSave = async () => {
    if (!user || !diary || !title || !content || selected === null) return;

    try {
      setSaving(true);
      setError(null);

      const selectedTag = EMOTION_TAGS[selected];
      const diaryData = {
        title,
        content,
        emotion: selectedTag.label,
        emoji: selectedTag.emoji,
      };

      const result = await updateDiary(diary.id, diaryData);
      
      if (result) {
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          router.push(`/diary/${diary.id}`);
        }, 1000);
      } else {
        setError('일기 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('일기 수정 오류:', err);
      setError('일기 수정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/diary/${params?.id}`);
  };

  if (authLoading || loading) {
    return (
      <Main>
        <LoadingText>로딩 중...</LoadingText>
      </Main>
    );
  }

  if (!user) {
    return (
      <Main>
        <Title>일기 수정</Title>
        <div style={{ textAlign: 'center', color: '#666' }}>
          로그인이 필요합니다.
        </div>
      </Main>
    );
  }

  if (error || !diary) {
    return (
      <Main>
        <Title>일기 수정</Title>
        <ErrorMsg>{error || '일기를 찾을 수 없습니다.'}</ErrorMsg>
        <CancelButton onClick={() => router.push("/diary")}>
          목록으로
        </CancelButton>
      </Main>
    );
  }

  return (
    <Main>
      <Title>일기 수정</Title>
      <TitleInput
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="일기 제목을 입력하세요..."
      />
      <Textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="오늘 느낀 감정을 자유롭게 적어보세요..."
      />
      <TagList>
        {EMOTION_TAGS.map((tag, idx) => (
          <TagButton
            key={tag.label}
            selected={selected === idx}
            onClick={() => setSelected(idx)}
            type="button"
          >
            <span style={{ fontSize: "1.3rem", marginRight: 6 }}>{tag.emoji}</span>
            {tag.label}
          </TagButton>
        ))}
      </TagList>
      <ButtonGroup>
        <SaveButton
          onClick={handleSave}
          disabled={!title || !content || selected === null || saving}
          type="button"
        >
          {saving ? "저장 중..." : "저장하기"}
        </SaveButton>
        <CancelButton onClick={handleCancel} type="button">
          취소
        </CancelButton>
      </ButtonGroup>
      {saved && <SavedMsg>저장되었습니다!</SavedMsg>}
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </Main>
  );
} 