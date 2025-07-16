"use client";
import { useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { useAuth } from "../../../lib/auth";

const Main = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f7f8fa;
  padding: 2rem;
`;

const Form = styled.form`
  background: #fff;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
`;

const Description = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1.5px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #6c63ff;
  }
`;

const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  background: #6c63ff;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.8rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  
  &:hover:not(:disabled) {
    background: #554ee0;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  
  a {
    color: #6c63ff;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email) {
      setError("이메일을 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess("비밀번호 재설정 이메일이 전송되었습니다. 이메일을 확인해주세요.");
      }
    } catch (err) {
      setError("비밀번호 재설정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main>
      <Form onSubmit={handleSubmit}>
        <Title>비밀번호 재설정</Title>
        <Description>
          가입하신 이메일 주소를 입력하시면<br />
          비밀번호 재설정 링크를 보내드립니다.
        </Description>
        
        <InputGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            required
          />
        </InputGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Button type="submit" disabled={loading}>
          {loading ? "전송 중..." : "비밀번호 재설정 이메일 보내기"}
        </Button>

        <LinkText>
          <Link href="/auth/login">로그인으로 돌아가기</Link>
        </LinkText>
      </Form>
    </Main>
  );
} 