'use server';
import { signInEmail, signOut } from '@/lib/auth-client';

export const login = async (email:string,password:string) => {
	return await signInEmail(email,password, true);
};

export const logout = async () => {
	return await signOut();
};
