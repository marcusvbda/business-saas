'use client';

import { useQuery } from '@tanstack/react-query';

export default function Page() {
	const { data, isFetching } = useQuery({
		queryKey: ['posts'],
		queryFn: () =>
			fetch('https://api.sampleapis.com/coffee/hot').then((res) => res.json()),
	});

	return (
		<div>
			{isFetching ? (
				'Laoding'
			) : (
				<ul>
					{(data || []).map((post) => (
						<li key={post.id}>{post.title}</li>
					))}
				</ul>
			)}
		</div>
	);
}
