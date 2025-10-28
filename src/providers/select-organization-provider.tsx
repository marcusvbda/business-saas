'use client';

import { EmptyStateOrganization } from '@/components/create-organization';
import Loading from '@/components/fallback';
import { authClient } from '@/lib/better-auth';
import { listOrganizations } from '@/server/organizations';
import { IWithChild } from '@/types/common';
import { useQuery } from '@tanstack/react-query';

export default function SelectOrganizationProvider({ children }: IWithChild) {
	const { data: session } = authClient.useSession();
	const { data: activeOrganization } = authClient.useActiveOrganization();

	const { data, isPending } = useQuery({
		queryKey: ['organization-list', session?.user?.id],
		queryFn: () => listOrganizations(session?.user?.id),
	});

	const hasOrganizations = ((data as any) || []).length;

	if (isPending) return <Loading />;
	if (!hasOrganizations) return <EmptyStateOrganization />;
	if (!activeOrganization) return <>Select org</>;

	return children;
}
