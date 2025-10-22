import { prisma } from '@/libs/prisma/prisma.service';
import { NextResponse } from 'next/server';

export const GET = async () => {
	const users = await prisma.user.findMany();
	return NextResponse.json(users);
};
