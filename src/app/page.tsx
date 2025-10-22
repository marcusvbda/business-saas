'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Home() {
	return (
		<div className="flex flex-col gap-1">
			<Link href="/coffee" className="text-blue-500 underline">
				Go to Coffee Page
			</Link>
			Home Page
		</div>
	);
}
