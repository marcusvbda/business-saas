'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function Page() {
	const { data, isFetching } = useQuery({
		queryKey: ['users'],
		queryFn: () => fetch('/api/users').then((res: any) => res.json()),
	});

	return (
		<div className="flex flex-col gap-1">
			<Link href="/" className="text-blue-500 underline">
				Go to Home Page
			</Link>
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
	);
}
