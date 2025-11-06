'use client';
import AdminTemplate from '@/components/admin-template';
import Crud from '@/components/crud';
import { ReactNode } from 'react';

export default function CustomInfo(): ReactNode {
	const columnsList = [
		{
			key: 'id',
			header: '#',
			sort: true,
			filter: true,
		},
		{
			key: 'name',
			header: 'Name',
			sort: true,
			filter: true,
		},
	];

	return (
		<AdminTemplate
			breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Custom info' }]}
		>
			<Crud
				entityId="customInfo"
				list={{
					columns: columnsList,
					perPage: 10,
				}}
			/>
		</AdminTemplate>
	);
}
