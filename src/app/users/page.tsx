'use client';

import { signOut } from '@/actions/auth';
import { getUsers } from '@/actions/users';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Page() {
	const { data, isFetching } = useQuery({
		queryKey: ['users'],
		queryFn: () => getUsers(),
	});

	const logoutHandler = async () => {
		await signOut();
		redirect('/auth/signin');
	};

	return (
		<div className="flex flex-col gap-1">
			<Link href="/" className="text-blue-500 underline">
				Go to Home Page
			</Link>
			<Button onClick={logoutHandler}>Logout</Button>
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
