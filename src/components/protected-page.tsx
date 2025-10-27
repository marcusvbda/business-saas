import { RedirectToSignIn, SignedIn } from '@daveyplate/better-auth-ui';
import { IWithChild } from '@/types/common';

export default function ProtectedPage({ children }: IWithChild) {
	return (
		<>
			<RedirectToSignIn />
			<SignedIn>{children}</SignedIn>
		</>
	);
}
