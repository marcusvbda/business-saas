'use client';
import AdminTemplate from '@/components/admin-template';
import PrivateChat from '@/components/private-chat';
import { useState } from 'react';

export default function TestPage() {
	const [shouldThrow, setShouldThrow] = useState(false);

	if (shouldThrow) {
		throw new Error('Forced error from Home page for testing');
	}

	return (
		<AdminTemplate
			breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Test Page' }]}
		>
			<h1>Teste</h1>
			<div style={{ marginTop: 12 }}>
				<button
					onClick={() => setShouldThrow(true)}
					className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
				>
					Force exception
				</button>
			</div>
			<PrivateChat />
		</AdminTemplate>
	);
}
