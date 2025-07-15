import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: '이메일과 비밀번호를 입력하세요.' });
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return res.status(409).json({ error: '이미 가입된 이메일입니다.' });
  }
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, password: hash } });
  return res.status(201).json({ ok: true });
} 