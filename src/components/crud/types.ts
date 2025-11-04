import { ReactNode } from 'react';

export interface IListRow {
	key: string;
	header?: any;
	cell?: any;
	sort?: any;
	filter?: any;
}

export interface ICrud {
	list: {
		cacheKey: string;
		fetchAction: any;
		getFetchParams?: any;
		loading?: ReactNode;
		emptyState?: ReactNode;
		noResults?: ReactNode;
		perPage?: number;
		columns: IListRow[];
		orderBy?: { [key: string]: 'desc' | 'asc' };
	};
}

export interface ICrudContextProvider extends ICrud {
	children: ReactNode;
}

export interface IFetchParams {
	page: number;
	perPage: number;
	orderBy: { [key: string]: 'desc' | 'asc' };
}
