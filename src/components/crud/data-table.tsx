'use client';

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
import { ReactNode, useState } from 'react';

export function DataTable() {
	const [page, setPage] = useState(1);

	const {
		list: { cacheKey, fetchAction, loading, perPage, emptyState, columns },
	} = useCrudContext();

	const fetchParams = {
		page,
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
		<div className="overflow-hidden rounded-lg border pb-4">
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
			{data?.meta?.totalPages > 1 && (
				<PaginationComp
					page={page}
					setPage={setPage}
					totalPages={data.meta.totalPages}
				/>
			)}
		</div>
	);
}

interface IPaginationMeta {
	setPage: any;
	page: number;
	totalPages: number;
}

const PaginationComp = ({ page, setPage, totalPages }: IPaginationMeta) => {
	const clickPage = (e: any, newPage: number) => {
		e.preventDefault();
		if (newPage >= 1 && newPage <= totalPages) {
			setPage(newPage);
		}
	};

	const renderPages = (): ReactNode => {
		const showItems = 4;
		const items = [];

		let startPage = Math.max(1, page - Math.floor(showItems / 2));
		let endPage = startPage + showItems - 1;

		if (endPage > totalPages) {
			endPage = totalPages;
			startPage = Math.max(1, endPage - showItems + 1);
		}

		if (startPage > 1) {
			items.push(
				<PaginationItem key="start-ellipsis">
					<PaginationEllipsis
						className="cursor-pointer"
						onClick={(e: any) => clickPage(e, startPage - 1)}
					/>
				</PaginationItem>,
			);
		}

		for (let i = startPage; i <= endPage; i++) {
			items.push(
				<PaginationItem key={i}>
					<PaginationLink
						size="sm"
						href="#"
						isActive={page === i}
						onClick={(e: any) => clickPage(e, i)}
					>
						{i}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		if (endPage < totalPages) {
			items.push(
				<PaginationItem key="end-ellipsis">
					<PaginationEllipsis
						className="cursor-pointer"
						onClick={(e: any) => clickPage(e, endPage + 1)}
					/>
				</PaginationItem>,
			);
		}

		return items;
	};

	return (
		<Pagination>
			<PaginationContent>
				{page > 1 && (
					<PaginationItem>
						<PaginationPrevious
							size="sm"
							href="#"
							onClick={(e: any) => clickPage(e, page - 1)}
						/>
					</PaginationItem>
				)}

				{renderPages()}

				{page < totalPages && (
					<PaginationItem>
						<PaginationNext
							size="sm"
							href="#"
							onClick={(e: any) => clickPage(e, page + 1)}
						/>
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	);
};
