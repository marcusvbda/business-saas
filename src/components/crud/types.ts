import { ReactNode } from 'react';

export interface IListRow {
	key: string;
	header?: any;
	cell?: any;
	sort?: any;
	render?: any;
}

export interface ICrud {
	id: string;
	list: {
		fetchAction: any;
		getFetchParams?: any;
		render?: any;
		loading?: ReactNode;
		emptyState?: ReactNode;
		noResults?: ReactNode;
		perPage?: number;
		columns: IListRow[];
		orderBy?: { [key: string]: 'desc' | 'asc' };
	};
	slots: {
		beforeTable?: any;
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
