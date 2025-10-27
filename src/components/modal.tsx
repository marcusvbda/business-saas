'use client';
import {
	DialogHeader,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { ReactNode } from 'react';

interface IProps {
	visible: boolean;
	setVisible: any;
	title?: string | ReactNode;
	description?: string | ReactNode;
	footer?: string | ReactNode;
	content?: string | ReactNode;
}

export default function Modal({
	visible,
	setVisible,
	title,
	description,
	footer,
	content,
}: IProps) {
	return (
		<Dialog open={visible} onOpenChange={(x: any) => setVisible(x)}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title && title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				{content}
				<DialogFooter>{footer && footer}</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
