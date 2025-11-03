import { ReactNode } from 'react';

interface IListRow {
	className?: string;
	render: any;
}

export interface IListColumn {
	header: IListRow;
	body: IListRow;
}

export interface ICrud {
	list: {
		cacheKey: string;
		fetchAction: any;
		loading?: ReactNode;
		emptyState?: ReactNode;
		perPage?: number;
		columns: IListColumn[];
	};
}

export interface ICrudContextProvider extends ICrud {
	children: ReactNode;
}
