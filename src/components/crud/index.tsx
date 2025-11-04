'use client';

import { ReactNode } from 'react';
import { CrudContextProvider } from './context';
import { DataTable } from './data-table';
import { ICrudContextProvider } from './types';

export default function Crud({
	id,
	list,
	slots,
}: Omit<ICrudContextProvider, 'children'>): ReactNode {
	return (
		<CrudContextProvider id={id} list={list} slots={slots}>
			<Content />
		</CrudContextProvider>
	);
}

const Content = () => {
	return <DataTable />;
};
