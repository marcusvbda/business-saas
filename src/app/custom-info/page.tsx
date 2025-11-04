'use client';
import AdminTemplate from '@/components/admin-template';
import Crud from '@/components/crud';
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
					fetchAction: async (opts: any) =>
						await paginatedFetch('customInfo', opts),
					columns: [
						{
							key: 'id',
							sort: true,
						},
						{
							key: 'name',
							sort: true,
						},
					],
					// loading: <>Loading</>,
					// emptyState: <>Empty</>,
					perPage: 5,
				}}
			/>
		</AdminTemplate>
	);
}
