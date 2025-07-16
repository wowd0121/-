"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { FaGoogle, FaGithub } from "react-icons/fa";

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
const SocialBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #f7f8fa;
  border: 1.5px solid #d1d5db;
  border-radius: 2rem;
  padding: 0.7rem 1.2rem;
  font-size: 1.05rem;
  color: #444;
  cursor: pointer;
  transition: background 0.18s, border 0.18s;
  &:hover {
    background: #ecebff;
    border-color: #6c63ff;
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    // Supabase Auth 사용
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      router.push("/");
    } else {
      setMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setMsg("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setMsg("소셜 로그인에 실패했습니다.");
    setLoading(false);
  };

  return (
    <Wrap>
      <Form onSubmit={handleSubmit}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: 8 }}>로그인</h2>
        <SocialBtn type="button" onClick={() => handleSocialLogin("google")} disabled={loading}>
          <FaGoogle /> 구글로 로그인
        </SocialBtn>
        <SocialBtn type="button" onClick={() => handleSocialLogin("github")} disabled={loading}>
          <FaGithub /> 깃허브로 로그인
        </SocialBtn>
        <div style={{ textAlign: "center", color: "#bbb", fontSize: 13, margin: "8px 0 -2px 0" }}>또는 이메일로 로그인</div>
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
          {loading ? "로그인 중..." : "로그인"}
        </Button>
        {msg && <Msg>{msg}</Msg>}
        <LinkBtn type="button" onClick={() => router.push("/auth/forgot-password")}>비밀번호를 잊으셨나요?</LinkBtn>
        <LinkBtn type="button" onClick={() => router.push("/auth/register")}>회원가입</LinkBtn>
      </Form>
    </Wrap>
  );
} 