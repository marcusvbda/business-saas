'use client';
import AdminTemplate from '@/components/admin-template';
import Crud from '@/components/crud';
import { paginatedFetch } from '@/components/crud/server/actions';
import { IFetchParams } from '@/components/crud/types';
import { Input } from '@/components/ui/input';
import { ReactNode } from 'react';

export default function CustomInfo(): ReactNode {
	const beforeTableSlot = (cx: any) => {
		const { filterStates } = cx;
		const [filterState, setFilterState] = filterStates;
		return (
			<div className="flex justify-between items-center">
				<Input
					placeholder={'Search ...'}
					className="max-w-xs ml-auto"
					value={filterState}
					onChange={(e: any) => setFilterState(e.target.value)}
				/>
			</div>
		);
	};

	const fetchListAction = async (params: IFetchParams, cx: any) => {
		const { globalFilter } = cx;
		return await paginatedFetch('customInfo', {
			...params,
			...{
				filter: {
					name: globalFilter,
					id: globalFilter,
				},
			},
		});
	};

	const columnsList = [
		{
			key: 'id',
			header: '#',
			sort: true,
		},
		{
			key: 'name',
			header: 'Name',
			sort: true,
		},
	];

	return (
		<AdminTemplate
			breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Custom info' }]}
		>
			<Crud
				id="custom-info"
				slots={{
					beforeTable: beforeTableSlot,
				}}
				list={{
					fetchAction: fetchListAction,
					columns: columnsList,
					perPage: 10,
				}}
			/>
		</AdminTemplate>
	);
}
