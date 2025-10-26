'use client';
import { cn } from '@/lib/utils';
import { IWithChild } from '@/types/common';
import { useGlobalStore } from '@/stores/global';
import { Spinner } from '@/components/ui/spinner';

interface IProps extends IWithChild {
	className?: string;
	spinerClassName?: string;
	isLoading?: boolean;
}

export default function LoadingProvider({
	className = '',
	spinerClassName = '',
	children,
	isLoading = false,
}: IProps) {
	const { loading } = useGlobalStore();
	if (!loading && !isLoading) return children;

	return (
		<div className={cn('w-full flex items-center justify-center', className)}>
			<Spinner className={cn(spinerClassName, 'opacity-20')} />
		</div>
	);
}
