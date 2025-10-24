'use client';
import { ReactNode, useEffect, useState } from 'react';

export default function OnlyClient({ children }: { children: ReactNode }) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setVisible(true);
	}, []);

	return visible && children;
}
