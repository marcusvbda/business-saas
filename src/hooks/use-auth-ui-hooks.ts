import { AuthUIContext } from '@daveyplate/better-auth-ui';
import { useContext } from 'react';

export default function useAuthUiHooks() {
	const { hooks } = useContext(AuthUIContext);
	return hooks;
}
