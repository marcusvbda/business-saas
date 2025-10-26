'use client';

import { getUsers } from '@/actions/users';
import AdminTemplate from '@/components/admin-template';
import { Button } from '@/components/ui/button';
import { useGlobalStore } from '@/stores/global';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function Page() {
	const { setLoading } = useGlobalStore();
	const { data, isFetching } = useQuery({
		queryKey: ['users'],
		queryFn: () => getUsers(),
	});

	const loadingHandler = async () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};

	return (
		<AdminTemplate
			breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Users' }]}
		>
			<div className="flex flex-col gap-1">
				<Link href="/" className="text-blue-500 underline">
					Go to Home Page
				</Link>
				<Button onClick={loadingHandler}>Test loading</Button>
				{isFetching ? (
					'Laoding'
				) : (
					<ul>
						{(data || []).map((user: any) => (
							<li key={user.id}>{user.name}</li>
						))}
					</ul>
				)}
			</div>
		</AdminTemplate>
	);
}
