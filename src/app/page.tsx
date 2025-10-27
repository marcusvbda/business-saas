'use client';
import AdminTemplate from '@/components/admin-template';
import SelectOrganizationProvider from '@/providers/select-organization-provider/provider';

export default function Home() {
	return (
		<AdminTemplate breadcrumb={[{ label: 'Home' }]}>
			<SelectOrganizationProvider>
				<h1>Home</h1>
			</SelectOrganizationProvider>
		</AdminTemplate>
	);
}
