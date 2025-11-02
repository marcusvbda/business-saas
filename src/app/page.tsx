'use client';
import AdminTemplate from '@/components/admin-template';

export default function Home() {
	return (
		<AdminTemplate breadcrumb={[{ label: 'Home' }]}>
			<h1>Home</h1>
		</AdminTemplate>
	);
}
