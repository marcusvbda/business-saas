import AdminTemplate from '@/components/admin-template';
import SelectOrganizationProvider from '@/providers/select-organization-provider';

export default function TestPage() {
	return (
		<AdminTemplate
			breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Test Page' }]}
		>
			<SelectOrganizationProvider>
				<h1>Teste</h1>
			</SelectOrganizationProvider>
		</AdminTemplate>
	);
}
