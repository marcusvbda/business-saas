'use client';

import EmptyState from '@/components/empty-state';
import Loading from '@/components/fallback';
import TransactionBtn from '@/components/transaction-btn';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import useAuthUiHooks from '@/hooks/use-auth-ui-hooks';
import { authClient } from '@/lib/better-auth';
import { cn } from '@/lib/utils';
import { IWithChild } from '@/types/common';
import { CreateOrganizationDialog } from '@daveyplate/better-auth-ui';
import { Organization } from 'better-auth/plugins';
import { BuildingIcon, PlusIcon, Users2Icon } from 'lucide-react';
import { useState } from 'react';

export default function SelectOrganizationProvider({ children }: IWithChild) {
	const { data: activeOrganization, isPending } =
		authClient.useActiveOrganization();

	if (isPending) return <Loading />;
	if (!activeOrganization) return <ListOrganizations />;

	return children;
}

const ListOrganizations = () => {
	const { useListOrganizations } = useAuthUiHooks();
	const { data: organizations, isPending } = useListOrganizations();

	if (isPending) return <Loading />;
	return <SelectOrganization organizations={organizations || []} />;
};

interface ISelectOganization {
	organizations: Organization[];
}

const SelectOrganization = ({ organizations }: ISelectOganization) => {
	const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false);

	return (
		<>
			<EmptyState
				className="justify-start w-full"
				label="Select Organization"
				description="Choose witch organization you'd like to work with"
				icon={
					<Avatar className={cn('bg-muted size-12')}>
						<AvatarFallback className={cn('text-foreground')}>
							<BuildingIcon className={cn('size-[50%]')} />
						</AvatarFallback>
					</Avatar>
				}
				content={
					<div className="w-full flex flex-col gap-10">
						<div className="w-full flex items-center justify-center gap-2">
							{organizations.map((org: Organization) => (
								<OrganizationCard organization={org} key={org.id} />
							))}
						</div>
						<div>
							<TransactionBtn onClick={() => setIsCreateOrgDialogOpen(true)}>
								<PlusIcon />
								Create Organization
							</TransactionBtn>
						</div>
					</div>
				}
			/>
			<CreateOrganizationDialog
				open={isCreateOrgDialogOpen}
				onOpenChange={setIsCreateOrgDialogOpen}
			/>
		</>
	);
};

interface IOrganizationCard {
	organization: Organization;
}

const OrganizationCard = ({ organization }: IOrganizationCard) => {
	const selectOrganization = () => {
		authClient.organization.setActive({ organizationId: organization.id });
	};

	return (
		<Card className="w-full sm:w-4/12">
			<CardHeader>
				<CardTitle className="text-left">{organization.name}</CardTitle>
				<CardDescription className="text-left">
					@{organization.slug}
				</CardDescription>
				<CardAction>
					<TransactionBtn onClick={selectOrganization}>Select</TransactionBtn>
				</CardAction>
			</CardHeader>
			<CardFooter>
				<div className="flex items-center justify-center text-sm opacity-20 gap-2">
					<Users2Icon className="size-4!" /> Organization workspace
				</div>
			</CardFooter>
		</Card>
	);
};
