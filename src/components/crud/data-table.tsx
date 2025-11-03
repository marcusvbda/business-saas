'use client';

import * as React from 'react';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useCrudContext } from './context';
import { useQuery } from '@tanstack/react-query';
import Loading from '../fallback';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '../ui/empty';
import { IListColumn } from './types';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../ui/pagination';

export function DataTable() {
	const {
		list: { cacheKey, fetchAction, loading, perPage, emptyState, columns },
	} = useCrudContext();

	const fetchParams = {
		page: 1,
		perPage: perPage || 20,
		orderBy: { id: 'desc' },
	};

	const { data, isPending } = useQuery({
		queryFn: async () => fetchAction(fetchParams),
		queryKey: [cacheKey, JSON.stringify(fetchParams)],
	});

	const showEmptyState = (data?.meta?.total || 0) === 0;
	const dataItems = data?.items || [];

	if (isPending) {
		return loading || <Loading />;
	}

	return (
		<div className="overflow-hidden rounded-lg border">
			<Table>
				<TableHeader className="bg-muted sticky top-0 z-10">
					<TableRow>
						{columns.map((col: IListColumn, key: number) => (
							<TableHead key={key} className={col.header.className || ''}>
								{col.header.render()}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody className="**:data-[slot=table-cell]:first:w-8">
					{showEmptyState ? (
						<TableRow>
							<TableCell colSpan={2} className="h-24 text-center">
								<Empty className="justify-start">
									{emptyState || (
										<EmptyHeader>
											<EmptyTitle>No Registers</EmptyTitle>
											<EmptyDescription>No registers found</EmptyDescription>
										</EmptyHeader>
									)}
								</Empty>
							</TableCell>
						</TableRow>
					) : (
						dataItems.map((x: any, key: string) => (
							<TableRow key={key}>
								{columns.map((col: IListColumn, keyCol: number) => (
									<TableCell
										key={`${key}_${keyCol}`}
										className={col.body.className || ''}
									>
										{col.body.render(x)}
									</TableCell>
								))}
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious size="sm" href="#" />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink size="sm" href="#" isActive>
							1
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink size="sm" href="#">
							2
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink size="sm" href="#">
							3
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
					<PaginationItem>
						<PaginationNext size="sm" href="#" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
