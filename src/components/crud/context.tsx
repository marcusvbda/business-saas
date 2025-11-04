'use client';

import { createContext, ReactNode, useContext } from 'react';
import { ICrud, ICrudContextProvider } from './types';

const CrudContext = createContext<ICrud>({
	id: '',
	list: {
		fetchAction: () => {},
		loading: <></>,
		emptyState: <></>,
		perPage: 20,
		columns: [],
	},
	slots: {
		beforeTable: null,
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
	slots,
	id,
}: ICrudContextProvider): ReactNode => {
	return (
		<CrudContext.Provider
			value={{
				id,
				list,
				slots,
			}}
		>
			{children}
		</CrudContext.Provider>
	);
};
