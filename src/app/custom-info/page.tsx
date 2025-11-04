'use client';
import AdminTemplate from '@/components/admin-template';
import Crud from '@/components/crud';
import { IFetchParams } from '@/components/crud/types';
import { paginatedFetch } from '@/server/crud-common';
import { ReactNode } from 'react';

export default function CustomInfo(): ReactNode {
	return (
		<AdminTemplate
			breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Custom info' }]}
		>
			<Crud
				list={{
					cacheKey: 'custom-info-fetch',
					fetchAction: async (params: IFetchParams) => {
						return await paginatedFetch('customInfo', params);
					},
					columns: [
						{
							key: 'id',
							sort: true,
							filter: true,
						},
						{
							key: 'name',
							sort: true,
							filter: true,
						},
					],
					// loading: <>Loading</>,
					// emptyState: <>Empty</>,
					perPage: 10,
				}}
			/>
		</AdminTemplate>
	);
}
