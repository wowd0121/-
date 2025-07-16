"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { useAuth } from "../../lib/auth";

const UserContainer = styled.div`
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 1000;
`;

const UserButton = styled.button`
  background: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.2);
  transition: all 0.2s;
  
  &:hover {
    background: #554ee0;
    transform: scale(1.05);
  }
`;

const Menu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  min-width: 150px;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  margin-top: 0.5rem;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: #333;
  font-size: 0.9rem;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const UserInfo = styled.div`
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: #666;
`;

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.push("/");
  };

  if (!user) {
    return null;
  }

  return (
    <UserContainer>
      <UserButton onClick={() => setIsOpen(!isOpen)} title="사용자 메뉴">
        👤
      </UserButton>
      
      <Menu isOpen={isOpen}>
        <UserInfo>
          {user.email}
        </UserInfo>
        <MenuItem onClick={handleSignOut}>
          로그아웃
        </MenuItem>
      </Menu>
    </UserContainer>
  );
} 