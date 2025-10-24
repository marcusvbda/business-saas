import Link from 'next/link';

export default function Home() {
	return (
		<div className="flex flex-col gap-1">
			<Link href="/users" className="text-blue-500 underline">
				Go to Users page
			</Link>
			Home Page
		</div>
	);
}
