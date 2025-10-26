import { ReactNode } from 'react';

export interface IWithChild {
	children: ReactNode;
}

export interface IWithParams {
	params: Promise<any>;
}

export type IBreadcrumbItem = {
	href?: string;
	label: string;
};
