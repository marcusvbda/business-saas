'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { IWithChild } from '@/types/common';

export interface IInitialState {
	session: any;
	selectedWalletId: any;
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			retry: false,
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 30,
		},
	},
});

export default function ReactQueryClientProvider({ children }: IWithChild) {
	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools
				initialIsOpen={process.env.NODE_ENV === 'development'}
			/>
			{children}
		</QueryClientProvider>
	);
}
