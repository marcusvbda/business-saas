'use client';

import { logout } from '@/actions/auth';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Page() {
	const { data, isFetching } = useQuery({
		queryKey: ['users'],
		queryFn: () => fetch('/api/users').then((res: any) => res.json()),
	});

	const logoutHandler = async () => {
		await logout();
		redirect('/auth/signin');
	};

	return (
		<div className="flex flex-col gap-1">
			<Link href="/" className="text-blue-500 underline">
				Go to Home Page
			</Link>
			<button onClick={logoutHandler}>Logout</button>
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
