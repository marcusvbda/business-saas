'use client';

import { useEffect, useRef, useState } from 'react';

export default function useDebounceState(value: any, time = 800) {
	const [tempState, setTempState] = useState(value);
	const [state, setState] = useState(value);
	const filterRef = useRef(null);

	useEffect(() => {
		clearTimeout(filterRef.current);
		filterRef.current = setTimeout(() => {
			setState(tempState);
		}, time);

		return () => {
			clearTimeout(filterRef.current);
		};
	}, [tempState]);

	return [tempState, setTempState, state, setState];
}
