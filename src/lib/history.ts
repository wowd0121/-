export interface HistoryItem {
  id: string;
  title: string;
  date: string;
  type: 'diary' | 'chat';
  content?: string;
}

export const saveToHistory = (item: Omit<HistoryItem, 'id' | 'date'>) => {
  try {
    const historyItem: HistoryItem = {
      ...item,
      id: `${item.type}-${Date.now()}`,
      date: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const existingHistory = localStorage.getItem('emotion-history');
    const history: HistoryItem[] = existingHistory ? JSON.parse(existingHistory) : [];
    
    // 최대 50개까지만 저장
    const updatedHistory = [historyItem, ...history].slice(0, 50);
    
    localStorage.setItem('emotion-history', JSON.stringify(updatedHistory));
    
    return historyItem;
  } catch (error) {
    console.error('기록 저장에 실패했습니다:', error);
    return null;
  }
};

export const getHistory = (): HistoryItem[] => {
  try {
    const history = localStorage.getItem('emotion-history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('기록을 불러오는데 실패했습니다:', error);
    return [];
  }
};

export const deleteHistoryItem = (id: string): boolean => {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem('emotion-history', JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('기록 삭제에 실패했습니다:', error);
    return false;
  }
};

export const clearAllHistory = (): boolean => {
  try {
    localStorage.removeItem('emotion-history');
    return true;
  } catch (error) {
    console.error('모든 기록 삭제에 실패했습니다:', error);
    return false;
  }
}; 