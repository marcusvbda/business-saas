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
				cache={{
					keyList: 'custom-info-fetch',
				}}
				actions={{
					list: async (opts: any) => await paginatedFetch('customInfo', opts),
				}}
				// components={{
				// 	loadingList: <>Loading</>,
				// }}
				// ui={{
				// 	emptyState: {
				// 		label: 'teste',
				// 	},
				// }}
				// definitions={{
				// 	list: {
				// 		perPage: 20,
				// 	},
				// }}
			/>
		</AdminTemplate>
	);
}
