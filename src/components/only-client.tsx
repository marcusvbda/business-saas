'use client';

import { ReactNode, useEffect, useState } from 'react';

interface IProps {
	children: ReactNode;
}

export default function OnlyClient({ children }: IProps) {
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		setVisible(true);
	}, []);

	if (!visible) return;

	return children;
}
