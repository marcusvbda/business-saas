import { NextRequest } from 'next/server';
import { sendToSession } from '../route';

export async function POST(req: NextRequest) {
	const { sessionId, text } = await req.json();
	if (!sessionId || !text) {
		return new Response('Missing sessionId or text', {
			status: 400,
		});
	}

	sendToSession(sessionId, {
		value: text,
		event: 'test',
	});

	return new Response(JSON.stringify({ status: 'ok' }), {
		headers: { 'Content-Type': 'application/json' },
	});
}
