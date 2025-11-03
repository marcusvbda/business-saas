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
							header: {
								render: () => '#',
								className: 'w-[100px]',
							},
							body: {
								render: ({ id }) => id,
							},
						},
						{
							header: {
								render: () => 'Name',
							},
							body: {
								render: ({ name }) => name,
								className: 'font-bold',
							},
						},
					],
					// loading: <>Loading</>,
					// emptyState: <>Empty</>,
					// perPage: 20,
				}}
			/>
		</AdminTemplate>
	);
}
