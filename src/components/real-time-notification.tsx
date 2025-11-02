'use client';

import useAuthUiHooks from '@/hooks/use-auth-ui-hooks';
import { ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

export default function RealTimeNotification(): ReactNode {
	const { useSession } = useAuthUiHooks();
	const { data } = useSession();

	useEffect(() => {
		if (data?.user?.id) {
			const evtSource = new EventSource(
				`/api/sse?sessionId=real-time-notification[${data?.user?.id}]`,
			);

			evtSource.onmessage = ({ data }: any) => {
				const { event, value } = JSON.parse(data);
				if (event === 'toast') {
					toast.info(value);
				}
			};

			return () => evtSource.close();
		}
	}, [data]);

	return <></>;
}
