'use client';

import Loading from '@/components/fallback';
import { authClient } from '@/lib/better-auth';
import { IWithChild } from '@/types/common';
import { EmptyStateOrganization } from './create-organization';

export default function SelectOrganizationProvider({ children }: IWithChild) {
	const { data, isPending } = authClient.useListOrganizations();
	const hasOrganizations = (data || []).length;

	if (isPending) return <Loading />;
	if (!hasOrganizations) return <EmptyStateOrganization />;

	return children;
}
