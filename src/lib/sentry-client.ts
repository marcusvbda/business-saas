'use client';

import type * as SentryTypes from '@sentry/nextjs';

let initialized = false;
let sentry: typeof SentryTypes | null = null;

export function initSentryClient() {
	if (initialized) return sentry;
	initialized = true;

	const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
	if (!dsn) {
		sentry = null;
		return sentry;
	}

	// Dynamically import to avoid bundling when DSN is missing
	// Note: This function initializes once per client session
	// and caches the imported module in the closure above
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	import('@sentry/nextjs')
		.then((S) => {
			S.init({
				dsn,
				tracesSampleRate: 0,
			});
			sentry = S;
		})
		.catch(() => {
			sentry = null;
		});

	return sentry;
}

export function captureClientException(
	error: unknown,
	extras?: Record<string, unknown>,
) {
	const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
	if (!dsn) return;

	// If not yet initialized, kick it off
	if (!initialized) initSentryClient();

	const doCapture = (S: typeof SentryTypes) => {
		if (!S) return;
		S.captureException(
			error instanceof Error ? error : new Error(String(error)),
			(scope) => {
				if (extras) scope.setExtras(extras);
				return scope;
			},
		);
	};

	if (sentry) {
		doCapture(sentry);
	} else {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		import('@sentry/nextjs')
			.then((S) => {
				doCapture(S);
			})
			.catch(() => {});
	}
}
