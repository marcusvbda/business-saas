'use client';

import { IWithChild } from '@/types/common';
import { useEffect, useState } from 'react';

export default function OnlyClient({ children }: IWithChild) {
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		setVisible(true);
	}, []);

	if (!visible) return;

	return children;
}
