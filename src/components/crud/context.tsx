'use client';

import { createContext, ReactNode, useContext } from 'react';
import Loading from '../fallback';
import EmptyState from '../empty-state';
import { cn } from '@/lib/utils';
import { BoxIcon } from 'lucide-react';

export interface ICrud {
	cache: {
		keyList: string;
	};
	actions: {
		list: any;
	};
	components?: {
		loadingList?: ReactNode;
		emptyState?: ReactNode;
	};
	ui?: {
		emptyState?: {
			className?: string;
			label?: string;
			description?: string;
			icon?: string;
		};
	};
	definitions?: {
		list?: {
			perPage?: number;
		};
	};
}

const CrudContext = createContext<ICrud>({
	cache: {
		keyList: '',
	},
	actions: {
		list: () => {},
	},
	components: {
		loadingList: <></>,
		emptyState: <></>,
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
	actions,
	cache,
	components,
	ui,
	definitions,
}: any): ReactNode => {
	const { keyList } = cache;
	const { loadingList, emptyState } = components || {};
	const { emptyState: emptyStateUI } = ui || {};
	const { list: listDefinition } = definitions || {};

	return (
		<CrudContext.Provider
			value={{
				actions,
				cache: { keyList },
				components: {
					loadingList: loadingList || <Loading />,
					emptyState: emptyState || (
						<EmptyState
							className={cn('justify-start', emptyStateUI?.className)}
							label={emptyStateUI?.label || 'No Registers'}
							description={emptyStateUI?.description || 'No registers found'}
							icon={emptyStateUI?.icon || <BoxIcon className="size-24" />}
						/>
					),
				},
				definitions: {
					list: {
						perPage: listDefinition?.perPage || 20,
					},
				},
			}}
		>
			{children}
		</CrudContext.Provider>
	);
};
