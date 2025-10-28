'use client';

import Loading from '@/components/fallback';
import useAuthUiHooks from '@/hooks/use-auth-ui-hooks';
import { authClient } from '@/lib/better-auth';
import { IWithChild } from '@/types/common';
import { OrganizationsCard } from '@daveyplate/better-auth-ui';

export default function SelectOrganizationProvider({ children }: IWithChild) {
	const { data: activeOrganization } = authClient.useActiveOrganization();
	const { useListOrganizations } = useAuthUiHooks();
	const { data: organizations, isPending } = useListOrganizations();

	const hasOrganizations = ((organizations as any) || []).length;

	if (isPending) return <Loading />;
	if (!hasOrganizations || !activeOrganization) {
		return <OrganizationsCard />;
	}

	return children;
}
