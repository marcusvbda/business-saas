import { NextResponse } from 'next/server';
import { prisma } from '../../../prisma/prisma.service';

export const GET = async () => {
	const users = await prisma.user.findMany();
	return NextResponse.json(users);
};
