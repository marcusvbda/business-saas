'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import OnlyClient from './only-client';
import SocialLoginBtns from './social-login-btns';

export function SignupForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<OnlyClient>
			<div className={cn('flex flex-col gap-6', className)} {...props}>
				<Card className="overflow-hidden p-0">
					<CardContent className="grid p-0 md:grid-cols-2">
						<form className="p-6 md:p-8">
							<FieldGroup>
								<div className="flex flex-col items-center gap-2 text-center">
									<h1 className="text-2xl font-bold">Create your account</h1>
									<p className="text-muted-foreground text-sm text-balance">
										Enter your email below to create your account
									</p>
								</div>
								<Field>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input
										id="email"
										type="email"
										placeholder="m@example.com"
										required
									/>
									<FieldDescription>
										We&apos;ll use this to contact you. We will not share your
										email with anyone else.
									</FieldDescription>
								</Field>
								<Field>
									<Field className="grid grid-cols-2 gap-4">
										<Field>
											<FieldLabel htmlFor="password">Password</FieldLabel>
											<Input id="password" type="password" required />
										</Field>
										<Field>
											<FieldLabel htmlFor="confirm-password">
												Confirm Password
											</FieldLabel>
											<Input id="confirm-password" type="password" required />
										</Field>
									</Field>
									<FieldDescription>
										Must be at least 6 characters long.
									</FieldDescription>
								</Field>
								<Field>
									<Button type="submit">Create Account</Button>
								</Field>
								<SocialLoginBtns />
								<FieldDescription className="text-center">
									Already have an account? <a href="/auth/signin">Sign in</a>
								</FieldDescription>
							</FieldGroup>
						</form>
						<div className="bg-muted relative hidden md:block">
							<div
								style={{ width: '100%', height: '100%', position: 'relative' }}
							>
								<Image
									src="/assets/placeholder.svg"
									alt="Image"
									className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
									layout="fill"
								/>
							</div>
						</div>
					</CardContent>
				</Card>
				<FieldDescription className="px-6 text-center">
					By clicking continue, you agree to our{' '}
					<a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
				</FieldDescription>
			</div>
		</OnlyClient>
	);
}
