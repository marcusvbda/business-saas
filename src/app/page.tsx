import AdminTemplate from '@/components/admin-template';
import Link from 'next/link';

export default function Home() {
	return (
		<AdminTemplate breadcrumb={[{ label: 'Home' }]}>
			<div className="flex flex-col gap-1">
				<Link href="/users" className="text-blue-500 underline">
					Go to Users page
				</Link>
				Home Page
			</div>
		</AdminTemplate>
	);
}
