'use client';

import EmptyState from '@/components/empty-state';
import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';

import { EmptyContent, EmptyMedia } from '@/components/ui/empty';
import { IconAffiliate } from '@tabler/icons-react';
import { useState } from 'react';

export function EmptyStateOrganization() {
	const [visible, setVisible] = useState(false);

	return (
		<>
			<EmptyState
				icon={
					<EmptyMedia variant="icon">
						<IconAffiliate />
					</EmptyMedia>
				}
				label="No organizations yet"
				description="You haven't created any organization yet. Get started by creating your first organization."
				content={
					<EmptyContent>
						<Button onClick={() => setVisible(true)}>
							Create Organization
						</Button>
					</EmptyContent>
				}
			/>
			<Modal
				visible={visible}
				setVisible={(x: any) => setVisible(x)}
				title="Are you absolutely sure?"
				description="This action cannot be undone. This will permanently delete your
							account and remove your data from our servers."
				content="lorem ipsum"
				footer="footer aqui"
			/>
		</>
	);
}
