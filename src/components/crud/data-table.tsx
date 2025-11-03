'use client';

import * as React from 'react';

import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useCrudContext } from './context';
import { useQuery } from '@tanstack/react-query';

export function DataTable() {
	const {
		cache: { keyList },
		actions: { list },
		components: { loadingList, emptyState },
		definitions: {
			list: { perPage },
		},
	} = useCrudContext();
	const fetchParams = { page: 1, perPage, orderBy: { id: 'desc' } };

	const { data, isPending } = useQuery({
		queryFn: async () => list(fetchParams),
		queryKey: [keyList, JSON.stringify(fetchParams)],
	});

	if (isPending) return loadingList;

	if (!(data?.items || [])?.length && (data?.meta?.total || 0) === 0) {
		return emptyState;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">ID</TableHead>
					<TableHead>Name</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data?.items.map((x: any, key: string) => (
					<TableRow key={key}>
						<TableCell className="font-medium">{x.id}</TableCell>
						<TableCell>{x.name}</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={3}>Total</TableCell>
					<TableCell className="text-right">$2,500.00</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
}
