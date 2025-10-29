'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/better-auth';

type NotifyPayload = {
	text: string;
	url?: string;
	digest?: string | null;
	stack?: string | null;
	userAgent?: string | null;
	timestamp?: string;
	level?: string;
	context?: string;
};

export async function notifySlack(payload: NotifyPayload) {
	const webhookUrl = process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL;
	if (!webhookUrl) {
		throw new Error('NEXT_PUBLIC_SLACK_WEBHOOK_URL is not configured');
	}

	const hdrs = await headers();
	const forwardedFor = hdrs.get('x-forwarded-for') || '';
	const realIp = hdrs.get('x-real-ip') || '';
	const ipCandidate = forwardedFor.split(',')[0]?.trim() || realIp || 'unknown';
	const ua = payload.userAgent || hdrs.get('user-agent') || 'unknown';

	// get session to enrich with user info
	let userLine: string | undefined;
	try {
		const session = await auth.api.getSession({ headers: hdrs });
		const user = (session as any)?.user as
			| { id?: string; email?: string; name?: string }
			| undefined;
		if (user) {
			const parts = [user.name, user.email, user.id]
				.filter(Boolean)
				.join(' | ');
			userLine = parts ? `*User:* ${parts}` : undefined;
		}
	} catch {}

	const { text, url, digest, stack, timestamp, level, context } = payload;

	const lines: string[] = [];
	lines.push(':rotating_light: *Application Error*');
	if (level) lines.push(`*Level:* ${level.toUpperCase()}`);
	if (context) lines.push(`*Context:* ${context}`);
	lines.push(`*Message:* ${text}`);
	if (url) lines.push(`*URL:* ${url}`);
	if (timestamp) lines.push(`*When:* ${timestamp}`);
	if (userLine) lines.push(userLine);
	if (ipCandidate) lines.push(`*IP:* ${ipCandidate}`);
	if (ua) lines.push(`*User Agent:* ${ua}`);
	if (digest) {
		lines.push(`*Digest:*`);
		lines.push('```' + digest + '```');
	}
	if (stack) {
		lines.push(`*Stack:*`);
		lines.push('```' + stack + '```');
	}

	const textBody = lines.join('\n');

	const res = await fetch(webhookUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ text: textBody }),
		cache: 'no-store',
	});

	if (!res.ok) {
		const errText = await res.text().catch(() => '');
		throw new Error(`Slack webhook failed: ${errText || res.status}`);
	}

	return { ok: true } as const;
}
