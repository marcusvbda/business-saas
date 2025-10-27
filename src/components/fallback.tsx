import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

interface IProps {
	className?: string;
	spinerClassName?: string;
}

export default function Loading({
	className = '',
	spinerClassName = '',
}: IProps) {
	return (
		<div className={cn('w-full flex items-center justify-center', className)}>
			<Spinner className={cn(spinerClassName, 'opacity-20 size-6')} />
		</div>
	);
}
