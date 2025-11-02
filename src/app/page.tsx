'use client';
import AdminTemplate from '@/components/admin-template';
import SelectOrganization from '@/components/select-organization';

export default function Home() {
	return (
		<AdminTemplate breadcrumb={[{ label: 'Home' }]}>
			<SelectOrganization>
				<h1>Home</h1>
			</SelectOrganization>
		</AdminTemplate>
	);
}
