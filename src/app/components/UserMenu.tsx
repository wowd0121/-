"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { useAuth } from "../../lib/auth";

const UserContainer = styled.div`
  position: fixed;
  top: 1.2rem;
  right: 2rem;
  z-index: 2100;
`;

const UserButton = styled.button`
  background: #ecebff;
  color: #6c63ff;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.13);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s, color 0.18s;
  &:hover {
    background: #d8d6ff;
    color: #554ee0;
  }
`;

const Menu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 110%;
  right: 0;
  background: #fff;
  border-radius: 0.8rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.13);
  padding: 0.7rem 0;
  min-width: 200px;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  margin-top: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.7rem 1.2rem 0.7rem 1.2rem;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0.5rem;
`;
const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #ecebff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
`;
const Email = styled.div`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
`;
const MenuItem = styled.button`
  width: 100%;
  padding: 0.7rem 1.2rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: #444;
  font-size: 1rem;
  transition: background 0.15s;
  &:hover {
    background: #f7f8fa;
  }
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
        <span role="img" aria-label="avatar">👤</span>
      </UserButton>
      <Menu isOpen={isOpen}>
        <UserInfo>
          <Avatar>👤</Avatar>
          <Email>{user.email}</Email>
        </UserInfo>
        <MenuItem onClick={() => { setIsOpen(false); router.push("/profile"); }}>
          내 정보
        </MenuItem>
        <MenuItem onClick={() => { setIsOpen(false); router.push("/settings"); }}>
          설정
        </MenuItem>
        <MenuItem onClick={handleSignOut} style={{ color: '#e74c3c', fontWeight: 500 }}>
          로그아웃
        </MenuItem>
      </Menu>
    </UserContainer>
  );
}