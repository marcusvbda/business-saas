'use client';

import { createContext, ReactNode, useContext } from 'react';
import { ICrud, ICrudContextProvider } from './types';

const CrudContext = createContext<ICrud>({
	entityId: '',
	list: {
		fetchAction: () => {},
		loading: <></>,
		emptyState: <></>,
		perPage: 20,
		columns: [],
	},
});

export const useCrudContext = (): ICrud => {
	const ctx = useContext(CrudContext);
	if (!ctx) {
		throw new Error('useCrudContext must be arounded by CrudContext.Provider');
	}
	return ctx;
};

export const CrudContextProvider = ({
	children,
	list,
	entityId,
}: ICrudContextProvider): ReactNode => {
	return (
		<CrudContext.Provider
			value={{
				entityId,
				list,
			}}
		>
			{children}
		</CrudContext.Provider>
	);
};
