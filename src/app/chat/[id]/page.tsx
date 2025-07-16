"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import styled from "@emotion/styled";
import { useAuth } from "@/lib/auth";
import { getDiary } from "@/lib/diary";

const EMPATHY_STYLES = [
  { key: "listen", label: "🎧 그냥 들어줘" },
  { key: "explore", label: "🧠 나를 이해시켜줘" },
  { key: "suggest", label: "🪞 해결 방법을 알려줘" },
  { key: "open", label: "💬 자유롭게 얘기하고 싶어" },
];
const TONES = [
  { key: "pro", label: "🧑‍⚕️ 전문가" },
  { key: "friend", label: "🧑‍🤝‍🧑 친구" },
  { key: "cute", label: "🐥 캐릭터" },
];

const Wrap = styled.main`
  min-height: 100vh;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5rem;
`;
const DiaryBox = styled.div`
  background: #fffbe7;
  border-radius: 1rem;
  padding: 1.1rem 1.2rem;
  margin-bottom: 1.5rem;
  width: 350px;
  max-width: 95vw;
  color: #333;
  font-size: 1.05rem;
`;
const ChatBox = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.07);
  width: 350px;
  max-width: 95vw;
  min-height: 320px;
  padding: 1.2rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
`;
const ChatMsg = styled.div<{ user?: boolean }>`
  align-self: ${({ user }) => (user ? "flex-end" : "flex-start")};
  background: ${({ user }) => (user ? "#ecebff" : "#f2f2f2")};
  color: #333;
  border-radius: 1.2rem;
  padding: 0.6rem 1.1rem;
  max-width: 80%;
  font-size: 1.03rem;
`;
const InputRow = styled.form`
  display: flex;
  gap: 0.5rem;
  width: 350px;
  max-width: 95vw;
`;
const Input = styled.input`
  flex: 1;
  border: 1.5px solid #d1d5db;
  border-radius: 1.5rem;
  padding: 0.7rem 1.1rem;
  font-size: 1rem;
  background: #fff;
`;
const SendBtn = styled.button`
  background: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
`;
const OptionRow = styled.div`
  display: flex;
  gap: 0.7rem;
  margin-bottom: 1.1rem;
`;
const OptionBtn = styled.button<{ selected: boolean }>`
  background: ${({ selected }) => (selected ? "#6c63ff" : "#fff")};
  color: ${({ selected }) => (selected ? "#fff" : "#333")};
  border: 1.5px solid #d1d5db;
  border-radius: 1.5rem;
  padding: 0.4rem 1.1rem;
  font-size: 1.05rem;
  cursor: pointer;
  transition: background 0.2s;
  outline: none;
  &:hover {
    background: #ecebff;
  }
`;

// OpenAI API 호출 함수 (서버리스 API route 사용)
async function fetchChat(messages: { role: string; content: string }[]) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error("AI 응답 실패");
  const data = await res.json();
  return data.result as string;
}

function getEmpathyPrompt(style: string) {
  switch (style) {
    case "listen":
      return "내 이야기를 잘 들어주고, 공감 위주로 반응해줘.";
    case "explore":
      return "내 감정의 원인이나 의미를 함께 탐색해줘.";
    case "suggest":
      return "상황을 개선할 수 있는 구체적인 행동이나 팁을 제안해줘.";
    case "open":
      return "자유롭게 대화해줘. 어떤 주제든 괜찮아.";
    default:
      return "공감해줘.";
  }
}
function getTonePrompt(tone: string) {
  switch (tone) {
    case "pro":
      return "진지하고 차분한 전문가 말투로 답변해줘.";
    case "friend":
      return "다정하고 따뜻한 친구 말투로 답변해줘.";
    case "cute":
      return "귀엽고 가벼운 캐릭터 말투로 답변해줘.";
    default:
      return "자연스럽게 답변해줘.";
  }
}

export default function ChatPage() {
  const params = useParams() as any;
  const { user, loading: authLoading } = useAuth();
  const [diary, setDiary] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [empathy, setEmpathy] = useState("listen");
  const [tone, setTone] = useState("pro");
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setError("로그인이 필요합니다.");
      setDiary(null);
      return;
    }
    const fetchDiary = async () => {
      if (!params || !params.id) {
        setError("잘못된 접근입니다.");
        setDiary(null);
        return;
      }
      const diaryData = await getDiary(params.id as string);
      if (!diaryData) {
        setError("일기를 찾을 수 없습니다.");
        setDiary(null);
        return;
      }
      if (diaryData.user_id !== user.id) {
        setError("접근 권한이 없습니다.");
        setDiary(null);
        return;
      }
      setDiary(diaryData);
      setMessages([
        { user: false, text: "안녕하세요! 감정일기를 읽고 공감 대화를 시작할게요." },
      ]);
    };
    fetchDiary();
  }, [params.id, user, authLoading]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { user: true, text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      // 시스템 프롬프트 + 공감스타일/톤 + 이전 대화 + 일기 내용 포함
      const chatHistory = [
        { role: "system", content: `다음은 사용자의 감정일기입니다.\n일기: ${diary?.text || ""}\n${getEmpathyPrompt(empathy)} ${getTonePrompt(tone)}` },
        ...messages.map((m) => ({ role: m.user ? "user" : "assistant", content: m.text })),
        { role: "user", content: input },
      ];
      const aiReply = await fetchChat(chatHistory);
      setMessages((prev) => [...prev, { user: false, text: aiReply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { user: false, text: "AI 응답에 실패했습니다." }]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <Wrap>로딩 중...</Wrap>;
  }
  if (error) {
    return <Wrap>{error}</Wrap>;
  }
  if (!diary) {
    return <Wrap>일기를 찾을 수 없습니다.</Wrap>;
  }

  return (
    <Wrap>
      <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: 12 }}>AI 챗봇 감정 대화</h2>
      <OptionRow>
        {EMPATHY_STYLES.map(opt => (
          <OptionBtn
            key={opt.key}
            selected={empathy === opt.key}
            onClick={() => setEmpathy(opt.key)}
            type="button"
          >
            {opt.label}
          </OptionBtn>
        ))}
      </OptionRow>
      <OptionRow>
        {TONES.map(opt => (
          <OptionBtn
            key={opt.key}
            selected={tone === opt.key}
            onClick={() => setTone(opt.key)}
            type="button"
          >
            {opt.label}
          </OptionBtn>
        ))}
      </OptionRow>
      <DiaryBox>
        <b>일기 내용:</b>
        <div style={{ marginTop: 6 }}>{diary.text}</div>
      </DiaryBox>
      <ChatBox ref={chatRef}>
        {messages.map((msg, i) => (
          <ChatMsg key={i} user={msg.user}>{msg.text}</ChatMsg>
        ))}
        {loading && <ChatMsg>(AI 응답 생성 중...)</ChatMsg>}
      </ChatBox>
      <InputRow onSubmit={handleSend}>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="챗봇에게 메시지 보내기..."
          disabled={loading}
        />
        <SendBtn type="submit" disabled={loading}>전송</SendBtn>
      </InputRow>
    </Wrap>
  );
} 