'use client';

import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // 🔹 Import do input
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
import { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { IFetchParams } from './types';

export function DataTable() {
	const {
		list: {
			fetchAction,
			perPage,
			cacheKey,
			columns,
			loading,
			emptyState,
			noResults,
			orderBy,
			render,
			filterPlaceholder,
		},
	} = useCrudContext();

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: perPage || 20,
	});

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [globalTempFilter, setGlobalTempFilter] = useState('');
	const [globalFilter, setGlobalFilter] = useState('');
	const filterRef = useRef(null);

	useEffect(() => {
		clearTimeout(filterRef.current);
		filterRef.current = setTimeout(() => {
			setGlobalFilter(globalTempFilter);
		}, 800);

		return () => {
			clearTimeout(filterRef.current);
		};
	}, [globalTempFilter]);

	useEffect(() => {
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	}, [globalFilter]);

	const orderByFromSorting = (sortingState: SortingState) => {
		const order: Record<string, 'asc' | 'desc'> = {};
		for (const s of sortingState) {
			if (!s.id) continue;
			order[s.id] = s.desc ? 'desc' : 'asc';
		}
		return order;
	};

	const filterObject = useMemo(() => {
		if (!globalFilter) return {};
		const filterableColumns = columns.filter((c: any) => c.filter);
		const filters: Record<string, string> = {};
		for (const col of filterableColumns) {
			filters[col.key] = globalFilter;
		}
		return filters;
	}, [columns, globalFilter]);

	const fetchParams: IFetchParams = {
		page: pagination.pageIndex + 1,
		perPage: pagination.pageSize,
		orderBy: orderByFromSorting(sorting) || orderBy || { id: 'desc' },
	};

	const { data: queryResult, isPending } = useQuery({
		queryFn: async () => fetchAction({ ...fetchParams, filter: filterObject }),
		queryKey: [cacheKey, fetchParams, filterObject],
	});

	const totalPages = queryResult?.meta?.totalPages;

	const cols = useMemo(() => {
		return columns.map((col: any) => ({
			accessorKey: col.key,
			header: col?.header ?? col.key,
			cell: col?.cell ?? ((row) => row.getValue(col.key)),
			enableSorting: Boolean(col?.sort),
		}));
	}, [columns]);

	const table = useReactTable({
		data: queryResult?.items || [],
		columns: cols as any,
		manualPagination: true,
		pageCount: totalPages,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			pagination,
		},
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const canPreviousPage = pagination.pageIndex > 0;
	const canNextPage = pagination.pageIndex + 1 < totalPages;

	const showEmptyState = (queryResult?.meta?.total || 0) === 0;

	return (
		<div className="w-full space-y-3">
			<div className="flex justify-between items-center">
				<Input
					placeholder={filterPlaceholder || 'Search ...'}
					className="max-w-xs ml-auto"
					value={globalTempFilter}
					onChange={(e: any) => setGlobalTempFilter(e.target.value)}
				/>
			</div>
			{isPending ? (
				loading || <Loading />
			) : showEmptyState ? (
				<Empty className="justify-start">
					{emptyState || (
						<EmptyHeader>
							<EmptyTitle>No Registers</EmptyTitle>
							<EmptyDescription>No registers found</EmptyDescription>
						</EmptyHeader>
					)}
				</Empty>
			) : (
				<>
					{render ? (
						render(table)
					) : (
						<div className="overflow-hidden rounded-md border">
							<Table>
								<TableHeader>
									{table.getHeaderGroups().map((headerGroup) => (
										<TableRow key={headerGroup.id}>
											{headerGroup.headers.map((header) => {
												const canSort = header.column.getCanSort();
												const sortDirection = header.column.getIsSorted();

												return (
													<TableHead
														key={header.id}
														onClick={
															canSort
																? header.column.getToggleSortingHandler()
																: undefined
														}
														className={
															canSort ? 'cursor-pointer select-none' : ''
														}
													>
														{header.isPlaceholder ? null : (
															<div className="flex items-center gap-1">
																{flexRender(
																	header.column.columnDef.header,
																	header.getContext(),
																)}
																{sortDirection === 'asc' && (
																	<ArrowDown className="size-3" />
																)}
																{sortDirection === 'desc' && (
																	<ArrowUp className="size-3" />
																)}
															</div>
														)}
													</TableHead>
												);
											})}
										</TableRow>
									))}
								</TableHeader>
								<TableBody>
									{table.getRowModel().rows?.length ? (
										table.getRowModel().rows.map((row) => (
											<TableRow
												key={row.id}
												data-state={row.getIsSelected() && 'selected'}
											>
												{row.getVisibleCells().map((cell) => (
													<TableCell key={cell.id}>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext(),
														)}
													</TableCell>
												))}
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={columns.length}
												className="h-24 text-center"
											>
												{noResults ? noResults : <>No results.</>}
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					)}

					<div className="flex items-center justify-end space-x-2 py-4">
						<div className="text-muted-foreground flex-1 text-sm">
							Page {pagination.pageIndex + 1} of {totalPages}
						</div>
						<div className="space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setPagination((old) => ({
										...old,
										pageIndex: Math.max(old.pageIndex - 1, 0),
									}))
								}
								disabled={!canPreviousPage}
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setPagination((old) => ({
										...old,
										pageIndex: Math.min(old.pageIndex + 1, totalPages - 1),
									}))
								}
								disabled={!canNextPage}
							>
								Next
							</Button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
