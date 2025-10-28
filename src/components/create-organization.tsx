'use client';
import EmptyState from '@/components/empty-state';
import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import { EmptyContent, EmptyMedia } from '@/components/ui/empty';
import { IconAffiliate } from '@tabler/icons-react';
import { useActionState, useEffect, useState } from 'react';
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { createOrganization } from '@/server/organizations';
import TransactionBtn from '@/components/transaction-btn';
import { toast } from 'sonner';
import { authClient } from '@/lib/better-auth';
import { useQueryClient } from '@tanstack/react-query';

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
			<ModalForm visible={visible} setVisible={(x: any) => setVisible(x)} />
		</>
	);
}

interface IModalForm {
	visible: boolean;
	setVisible: any;
}

const ModalForm = ({ visible, setVisible }: IModalForm) => {
	const { data: session } = authClient.useSession();
	const queryClient = useQueryClient();

	const [state, formAction, pending] = useActionState(createOrganization, {
		name: '',
		slug: '',
	});

	useEffect(() => {
		if (state?.success) {
			setVisible(false);
			if (state?.message) {
				toast.success(state?.message);
			}
			if (state?.orgId) {
				authClient.organization.setActive({ organizationId: state.orgId });
			}
			queryClient.invalidateQueries({
				queryKey: ['organization-list', session?.user?.id],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	return (
		<Modal
			visible={visible}
			setVisible={(x: any) => setVisible(x)}
			title="Create organization"
			description="Provide a name for your organization. You can invite members later."
			content={
				<form
					action={formAction}
					className="space-y-4"
					id="form-create-organization"
				>
					<Field>
						<FieldLabel>Organization name</FieldLabel>
						<FieldContent>
							<Input
								name="name"
								placeholder="Acme, Inc."
								aria-invalid={!!state?.errors?.name}
								defaultValue={state?.fields?.name}
							/>
							<FieldError>{state?.errors?.name as any}</FieldError>
						</FieldContent>
					</Field>
					<Field>
						<FieldLabel>Organization slug</FieldLabel>
						<FieldContent>
							<Input
								name="slug"
								placeholder="acme-inc"
								aria-invalid={!!state?.errors?.slug}
								defaultValue={state?.fields?.slug}
							/>
							<FieldError>{state?.errors?.slug as any}</FieldError>
						</FieldContent>
					</Field>
				</form>
			}
			footer={
				<div className="flex items-center justify-end gap-2">
					<Button variant="ghost" onClick={() => setVisible(false)}>
						Cancel
					</Button>
					<TransactionBtn
						loading={pending}
						type="submit"
						form="form-create-organization"
					>
						Create Organization
					</TransactionBtn>
				</div>
			}
		/>
	);
};
