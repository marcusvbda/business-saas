'use client';

import { ReactNode } from 'react';
import { CrudContextProvider } from './context';
import { DataTable } from './data-table';

export default function Crud({
	actions,
	cache,
	components = {},
	ui = {},
	definitions = {},
}: any): ReactNode {
	return (
		<CrudContextProvider
			actions={actions}
			cache={cache}
			components={components}
			ui={ui}
			definitions={definitions}
		>
			<Content />
		</CrudContextProvider>
	);
}

const Content = () => {
	return <DataTable />;
};
