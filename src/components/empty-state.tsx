import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from '@/components/ui/empty';
import { ReactNode } from '@tabler/icons-react';

interface IProps {
	label: string | ReactNode;
	description?: string | ReactNode;
	icon?: string | ReactNode;
	content?: string | ReactNode;
}

export default function EmptyState({
	label,
	description,
	icon,
	content,
}: IProps) {
	return (
		<Empty>
			<EmptyHeader>
				{icon && icon}
				<EmptyTitle>{label}</EmptyTitle>
				{description && <EmptyDescription>{description}</EmptyDescription>}
			</EmptyHeader>
			{content && content}
		</Empty>
	);
}
