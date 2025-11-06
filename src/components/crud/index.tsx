'use client';

import { ReactNode } from 'react';
import { CrudContextProvider } from './context';
import { DataTable } from './data-table';
import { ICrudContextProvider } from './types';

export default function Crud({
	entityId,
	list,
}: Omit<ICrudContextProvider, 'children'>): ReactNode {
	return (
		<CrudContextProvider entityId={entityId} list={list}>
			<Content />
		</CrudContextProvider>
	);
}

const Content = () => {
	return <DataTable />;
};
