"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

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
  padding: 2.5rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const WarningIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #e74c3c;
`;

const WarningMessage = styled.div`
  color: #e74c3c;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1.5px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  
  &:focus {
    outline: none;
    border-color: #e74c3c;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const DeleteButton = styled.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #c0392b;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 2rem;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
  font-weight: 500;
`;

const SuccessMessage = styled.div`
  color: #27ae60;
  margin-top: 1rem;
  font-weight: 500;
`;

export default function DeleteAccountPage() {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  const handleDeleteAccount = async () => {
    if (confirmText !== "탈퇴") {
      setError("정확히 '탈퇴'를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. 사용자의 모든 일기 삭제
      const { error: deleteDiariesError } = await supabase
        .from('diaries')
        .delete()
        .eq('user_id', user?.id);

      if (deleteDiariesError) {
        console.error('일기 삭제 오류:', deleteDiariesError);
        setError("데이터 삭제 중 오류가 발생했습니다.");
        return;
      }

      // 2. 로그아웃 처리 (계정은 비활성화되지만 완전 삭제는 수동으로 해야 함)
      await signOut();

      // 3. 성공 처리
      setSuccess(true);
      setError("");

      // 4. 3초 후 홈페이지로 이동
      setTimeout(() => {
        router.push("/");
      }, 3000);

    } catch (err) {
      console.error('계정 삭제 오류:', err);
      setError("계정 삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  if (!user) {
    return null;
  }

  if (success) {
    return (
      <Container>
        <Card>
          <WarningIcon>✅</WarningIcon>
          <Title>데이터 삭제 완료</Title>
          <SuccessMessage>
            모든 데이터가 성공적으로 삭제되었습니다.
          </SuccessMessage>
          <Description>
            로그아웃되었습니다. 홈페이지로 이동합니다.<br />
            완전한 계정 삭제를 원하시면 관리자에게 문의하세요.
          </Description>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <WarningIcon>⚠️</WarningIcon>
        <Title>회원 탈퇴</Title>
        <WarningMessage>
          이 작업은 되돌릴 수 없습니다!
        </WarningMessage>
        <Description>
          계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.<br />
          작성한 모든 일기와 데이터가 사라집니다.<br />
          이 작업은 되돌릴 수 없습니다.<br />
          정말로 탈퇴하시겠습니까?
        </Description>
        
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ color: "#666", marginBottom: "0.5rem" }}>
            계속하려면 아래에 <strong>"탈퇴"</strong>를 입력하세요:
          </p>
          <Input
            type="text"
            placeholder="탈퇴"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </div>

        <ButtonGroup>
          <CancelButton onClick={handleCancel}>
            취소
          </CancelButton>
          <DeleteButton 
            onClick={handleDeleteAccount}
            disabled={loading || confirmText !== "탈퇴"}
          >
            {loading ? "처리 중..." : "계정 삭제"}
          </DeleteButton>
        </ButtonGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Card>
    </Container>
  );
} 