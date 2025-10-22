import { authMiddleware } from '@/libs/auth-client';
import { ReactNode } from 'react';

export default function RestrictedLayout({
	children,
}: {
	children: ReactNode;
}) {
	return authMiddleware(children);
	// return authMiddleware(children);
}
