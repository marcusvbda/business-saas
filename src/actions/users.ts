'use server';
import { prisma } from '@/lib/prisma/prisma.service';

export const getUsers = async () => {
	const res = await prisma.user.findMany();
	return res;
};
