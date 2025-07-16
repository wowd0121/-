"use client";
import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { getHistory, deleteHistoryItem, clearAllHistory, type HistoryItem } from "../../lib/history";

const HistoryContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
`;

const HistoryButton = styled.button`
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

const HistoryModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.3rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #e9ecef;
`;

const HistoryInfo = styled.div`
  flex: 1;
`;

const HistoryTitle = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const HistoryDate = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const DeleteButton = styled.button`
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #c82333;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
`;

export default function HistoryManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // 로컬 스토리지에서 기록 불러오기
    const loadHistory = () => {
      const savedHistory = getHistory();
      setHistory(savedHistory);
    };

    loadHistory();
  }, []);

  const handleDeleteItem = (id: string) => {
    if (deleteHistoryItem(id)) {
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm('모든 기록을 삭제하시겠습니까?')) {
      if (clearAllHistory()) {
        setHistory([]);
      }
    }
  };

  return (
    <>
      <HistoryContainer>
        <HistoryButton onClick={() => setIsOpen(true)} title="기록 확인">
          📋
        </HistoryButton>
      </HistoryContainer>

      <HistoryModal isOpen={isOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>내 기록</ModalTitle>
            <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
          </ModalHeader>

          {history.length === 0 ? (
            <EmptyState>
              <div>📝</div>
              <p>아직 기록이 없습니다</p>
              <p>일기를 작성하거나 AI와 대화해보세요!</p>
            </EmptyState>
          ) : (
            <>
              <HistoryList>
                {history.map((item) => (
                  <HistoryItem key={item.id}>
                    <HistoryInfo>
                      <HistoryTitle>
                        {item.type === 'diary' ? '📖' : '💬'} {item.title}
                      </HistoryTitle>
                      <HistoryDate>{item.date}</HistoryDate>
                    </HistoryInfo>
                    <DeleteButton onClick={() => handleDeleteItem(item.id)}>
                      삭제
                    </DeleteButton>
                  </HistoryItem>
                ))}
              </HistoryList>
              
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button
                  onClick={handleClearAllHistory}
                  style={{
                    background: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.25rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer'
                  }}
                >
                  모든 기록 삭제
                </button>
              </div>
            </>
          )}
        </ModalContent>
      </HistoryModal>
    </>
  );
} 