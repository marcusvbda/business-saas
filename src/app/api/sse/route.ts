import { NextRequest } from 'next/server';

type Client = {
	id: string;
	controller: ReadableStreamDefaultController;
};

let clients: Client[] = [];

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const sessionId = url.searchParams.get('sessionId');
	if (!sessionId) {
		return new Response('Missing sessionId', { status: 400 });
	}

	const stream = new ReadableStream({
		start(controller) {
			clients.push({ id: sessionId, controller });

			req.signal.addEventListener('abort', () => {
				clients = clients.filter((c) => c.id !== sessionId);
				controller.close();
			});
		},
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
		},
	});
}

export function sendToSession(sessionId: string, message: any) {
	const encoder = new TextEncoder();
	const client = clients.find((x: any) => x.id === sessionId);
	if (client) {
		client.controller.enqueue(
			encoder.encode(`data: ${JSON.stringify(message)}\n\n`),
		);
	}
}
