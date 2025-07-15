"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";

const Wrap = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f7f8fa;
`;
const Form = styled.form`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.07);
  padding: 2.2rem 2rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  width: 340px;
  max-width: 95vw;
`;
const Input = styled.input`
  border: 1.5px solid #d1d5db;
  border-radius: 1.5rem;
  padding: 0.8rem 1.1rem;
  font-size: 1rem;
  background: #fff;
`;
const Button = styled.button`
  background: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 0.5rem;
`;
const Msg = styled.div`
  color: #e74c3c;
  font-size: 1rem;
  margin-top: 0.5rem;
`;
const LinkBtn = styled.button`
  background: none;
  border: none;
  color: #6c63ff;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.7rem;
  text-decoration: underline;
`;

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setMsg("회원가입이 완료되었습니다! 로그인 해주세요.");
      } else {
        setMsg(data.error || "회원가입에 실패했습니다.");
      }
    } catch {
      setMsg("네트워크 오류로 회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrap>
      <Form onSubmit={handleSubmit}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: 8 }}>회원가입</h2>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </Button>
        {msg && <Msg style={{ color: success ? "#27ae60" : undefined }}>{msg}</Msg>}
        <LinkBtn type="button" onClick={() => router.push("/auth/login")}>이미 계정이 있으신가요? 로그인</LinkBtn>
      </Form>
    </Wrap>
  );
} 