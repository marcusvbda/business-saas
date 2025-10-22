'use server';
import { signInEmail, signOut } from '@/libs/auth-client';

export const login = async () => {
	await signInEmail('admin@admin.com', 'adminadmin');
};

export const logout = async () => {
	await signOut();
};
