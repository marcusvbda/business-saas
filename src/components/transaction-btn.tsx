import { ReactNode, useTransition } from 'react';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';

interface IProps {
	variant?:
		| 'link'
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost';
	type: 'button' | 'submit';
	className?: string;
	disabled?: boolean;
	showSpinner?: boolean;
	loading?: boolean;
	onClick?: any;
	children?: ReactNode;
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
}: IProps) {
	const [pending, startTransition] = useTransition();

	return (
		<Button
			variant={variant}
			type={type}
			className={className}
			disabled={pending || disabled || loading}
			onClick={() => onClick && startTransition(() => onClick())}
		>
			{(pending || loading) && showSpinner && <Spinner />}
			{children}
		</Button>
	);
}
