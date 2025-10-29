'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notifySlack } from '@/server/notify-slack';

type ErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const notify = async () => {
			try {
				const fullUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
				const payload = {
					text: error?.message ?? 'Unknown error',
					url: fullUrl,
					digest: (error as any)?.digest ?? null,
					stack:
						(error?.stack || '').split('\n').slice(0, 8).join('\n') || null,
					userAgent:
						typeof navigator !== 'undefined' ? navigator.userAgent : null,
					timestamp: new Date().toISOString(),
					level: 'error',
					context: 'Next.js Error Boundary',
				};
				await notifySlack(payload);
			} catch (e: any) {
				// ignore
			}
		};

		if (process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL) {
			notify();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="mx-auto w-full max-w-2xl p-6">
			<Card>
				<CardHeader>
					<CardTitle>Something went wrong</CardTitle>
					<CardDescription>
						We detected an application error. A report will be sent to our team.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div>
							<div className="text-sm font-medium text-muted-foreground">
								Message
							</div>
							<div className="text-base">
								{error?.message ?? 'Unknown error'}
							</div>
						</div>
						<div>
							<div className="text-sm font-medium text-muted-foreground">
								Location
							</div>
							<div className="text-sm">
								{pathname}
								{searchParams.toString() ? `?${searchParams.toString()}` : ''}
							</div>
						</div>

						{error?.stack && process.env.NODE_ENV === 'development' && (
							<div>
								<div className="text-sm font-medium text-muted-foreground">
									Stack (top)
								</div>
								<pre className="mt-1 max-h-48 overflow-auto rounded-md bg-muted p-3 text-xs">
									{(error.stack || '').split('\n').slice(0, 8).join('\n')}
								</pre>
							</div>
						)}
						<div className="pt-2">
							<Button onClick={() => reset()}>Try again</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
