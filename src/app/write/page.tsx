/** @jsxImportSource @emotion/react */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";

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
const SavedMsg = styled.div`
  margin-top: 1.2rem;
  color: #6c63ff;
  font-weight: bold;
`;

export default function WritePage() {
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    if (!text || selected === null) return;
    const diary = {
      id: Date.now().toString(),
      text,
      tag: EMOTION_TAGS[selected],
      date: new Date().toISOString(),
    };
    const prev = JSON.parse(localStorage.getItem("diaries") || "[]");
    localStorage.setItem("diaries", JSON.stringify([diary, ...prev]));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push("/diary");
    }, 1000);
    setText("");
    setSelected(null);
  };

  return (
    <Main>
      <Title>오늘의 감정일기 작성</Title>
      <Textarea
        value={text}
        onChange={e => setText(e.target.value)}
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
      <SaveButton
        onClick={handleSave}
        disabled={!text || selected === null}
        type="button"
      >
        저장하기
      </SaveButton>
      {saved && <SavedMsg>저장되었습니다!</SavedMsg>}
    </Main>
  );
} 