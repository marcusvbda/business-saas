import { useTransition } from 'react';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { IWithChild } from '@/types/common';

interface IProps extends IWithChild {
	variant?:
		| 'link'
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost';
	type?: 'button' | 'submit';
	className?: string;
	disabled?: boolean;
	showSpinner?: boolean;
	loading?: boolean;
	onClick?: any;
	loadingContent?: any;
	form?: string;
}

export default function TransactionBtn({
	variant = 'default',
	type = 'button',
	className = '',
	disabled = false,
	loading = false,
	onClick = null,
	showSpinner = false,
	children = null,
	loadingContent = null,
	form = null,
}: IProps) {
	const [pending, startTransition] = useTransition();

	return (
		<Button
			variant={variant}
			type={type}
			className={className}
			disabled={pending || disabled || loading}
			onClick={() => onClick && startTransition(() => onClick())}
			form={form}
		>
			{(pending || loading) && showSpinner && <Spinner />}
			{pending && loadingContent ? loadingContent : children}
		</Button>
	);
}
