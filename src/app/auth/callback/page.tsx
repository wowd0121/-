"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "@emotion/styled";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f7f8fa;
  padding: 2rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.07);
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
`;

const Message = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const Button = styled.button`
  background: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #554ee0;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const SuccessMessage = styled.div`
  color: #27ae60;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!searchParams) {
          setStatus('error');
          setMessage('인증 정보를 찾을 수 없습니다.');
          return;
        }

        // URL 파라미터에서 인증 정보 확인
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');

        if (accessToken && refreshToken) {
          // 인증 성공
          setStatus('success');
          setMessage('이메일 인증이 완료되었습니다! 로그인해주세요.');
          
          // 3초 후 로그인 페이지로 이동
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage('인증 정보가 올바르지 않습니다.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('인증 처리 중 오류가 발생했습니다.');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  const handleGoToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <Container>
      <Card>
        {status === 'loading' && (
          <>
            <Title>인증 처리 중...</Title>
            <Message>
              이메일 인증을 처리하고 있습니다. 잠시만 기다려주세요.
            </Message>
          </>
        )}
        
        {status === 'success' && (
          <>
            <SuccessIcon>✅</SuccessIcon>
            <Title>인증 완료</Title>
            <SuccessMessage>{message}</SuccessMessage>
            <Message>
              자동으로 로그인 페이지로 이동합니다.
            </Message>
            <Button onClick={handleGoToLogin}>
              로그인 페이지로 이동
            </Button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <Title>인증 실패</Title>
            <ErrorMessage>{message}</ErrorMessage>
            <Message>
              다시 시도하거나 고객센터에 문의해주세요.
            </Message>
            <Button onClick={handleGoToLogin}>
              로그인 페이지로 이동
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
} 