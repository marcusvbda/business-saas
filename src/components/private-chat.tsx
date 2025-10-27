'use client';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function PrivateChat() {
	const [messages, setMessages] = useState<any[]>([]);
	const [input, setInput] = useState('');
	const [sessionId] = useState(() => `private-chat[${uuidv4()}]`);

	useEffect(() => {
		const evtSource = new EventSource(`/api/sse?sessionId=${sessionId}`);

		evtSource.onmessage = ({ data }: any) => {
			const event = JSON.parse(data);
			setMessages((prev) => [...prev, event]);
		};

		return () => evtSource.close();
	}, [sessionId]);

	const sendMessage = async () => {
		if (!input) return;
		await fetch('/api/sse/test', {
			method: 'POST',
			body: JSON.stringify({
				sessionId: sessionId,
				text: input,
			}),
			headers: { 'Content-Type': 'application/json' },
		});
		setInput('');
	};

	return (
		<div>
			<h3>Session ID : {sessionId}</h3>
			<div className="h-40 overflow-y-auto border p-2">
				{messages.map((m, i) => (
					<div key={i}>{m.value}</div>
				))}
			</div>
			<input
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
			/>
			<button onClick={sendMessage}>Enviar</button>
		</div>
	);
}
