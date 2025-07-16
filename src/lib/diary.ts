import { supabase } from './supabase';

export interface Diary {
  id: string;
  user_id: string;
  title: string;
  content: string;
  emotion: string;
  emoji: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDiaryData {
  title: string;
  content: string;
  emotion: string;
  emoji: string;
}

// 일기 목록 조회
export async function getDiaries(userId: string): Promise<Diary[]> {
  try {
    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('일기 목록 조회 오류:', error);
    return [];
  }
}

// 일기 상세 조회
export async function getDiary(id: string): Promise<Diary | null> {
  try {
    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('일기 상세 조회 오류:', error);
    return null;
  }
}

// 일기 생성
export async function createDiary(userId: string, diaryData: CreateDiaryData): Promise<Diary | null> {
  try {
    const { data, error } = await supabase
      .from('diaries')
      .insert({
        user_id: userId,
        title: diaryData.title,
        content: diaryData.content,
        emotion: diaryData.emotion,
        emoji: diaryData.emoji,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('일기 생성 오류:', error);
    return null;
  }
}

// 일기 수정
export async function updateDiary(id: string, diaryData: Partial<CreateDiaryData>): Promise<Diary | null> {
  try {
    const { data, error } = await supabase
      .from('diaries')
      .update({
        ...diaryData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('일기 수정 오류:', error);
    return null;
  }
}

// 일기 삭제
export async function deleteDiary(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('diaries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('일기 삭제 오류:', error);
    return false;
  }
}

// 이전/다음 일기 조회
export async function getAdjacentDiaries(userId: string, currentId: string): Promise<{
  previous: Diary | null;
  next: Diary | null;
}> {
  try {
    // 현재 일기보다 이전 일기 (최신순)
    const { data: previousData } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', userId)
      .lt('created_at', (await getDiary(currentId))?.created_at || '')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 현재 일기보다 다음 일기 (최신순)
    const { data: nextData } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', userId)
      .gt('created_at', (await getDiary(currentId))?.created_at || '')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return {
      previous: previousData || null,
      next: nextData || null,
    };
  } catch (error) {
    console.error('인접 일기 조회 오류:', error);
    return { previous: null, next: null };
  }
} 