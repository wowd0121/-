"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";
import styled from "@emotion/styled";

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f8fa;
`;

const LoadingText = styled.div`
  color: #6c63ff;
  font-size: 1.1rem;
  font-weight: 600;
`;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>로딩 중...</LoadingText>
      </LoadingContainer>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 