'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import z from 'zod';
import Image from 'next/image';
import { Spinner } from './ui/spinner';
import { signInEmail } from '@/actions/auth';
import OnlyClient from './only-client';
import Link from 'next/link';
import SocialLoginBtns from './social-login-btns';

interface IForm {
	email: string;
	password: string;
	rememberMe: boolean;
}

export function LoginForm({ className, redirectTo, ...props }: any) {
	const formSchema = z.object({
		email: z.email(),
		password: z.string().min(6, 'Password must have more than 6 characters'),
		rememberMe: z.boolean(),
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isLoading, isSubmitting },
	} = useForm<IForm>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	});

	const onSubmit = async (data: IForm) => {
		const error = await signInEmail(data.email, data.password, data.rememberMe);
		if (error) {
			return toast.error(error as any);
		}
		redirect(redirectTo);
	};

	return (
		<OnlyClient>
			<div className={cn('flex flex-col gap-6', className)} {...props}>
				<Card className="overflow-hidden py-0">
					<CardContent className="grid p-0 md:grid-cols-2">
						<form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
							<div className="flex flex-col gap-6">
								<div className="flex flex-col items-center text-center">
									<h1 className="text-2xl font-bold">Welcome back</h1>
									<p className="text-balance text-muted-foreground">
										Login to your Acme Inc account
									</p>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<div className="flex flex-col gap-1 mt-2">
										<Input
											id="email"
											placeholder="m@example.com"
											{...register('email')}
											className={`${
												errors.email
													? 'border-red-500 focus-visible:ring-red-500'
													: 'border-input focus-visible:ring-ring'
											}`}
										/>
										{errors.email && (
											<p className="text-xs text-red-500">
												{errors.email.message}
											</p>
										)}
									</div>
								</div>
								<div className="grid gap-2">
									<div className="flex items-center">
										<Label htmlFor="password">Password</Label>
										{/* <a
										href="#"
										className="ml-auto text-sm underline-offset-2 hover:underline"
									>
										Forgot your password?
									</a> */}
									</div>
									<div className="flex flex-col gap-1 mt-2">
										<Input
											id="password"
											type="password"
											{...register('password')}
											className={`${
												errors.password
													? 'border-red-500 focus-visible:ring-red-500'
													: 'border-input focus-visible:ring-ring'
											}`}
										/>
										{errors.password && (
											<p className="text-xs text-red-500">
												{errors.password.message}
											</p>
										)}

										<label className="flex items-center gap-2">
											<input type="checkbox" {...register('rememberMe')} />
											Remember me
										</label>
									</div>
								</div>
								<Button
									type="submit"
									className="w-full"
									disabled={isLoading || isSubmitting}
								>
									{(isLoading || isSubmitting) && <Spinner />}
									Login
								</Button>
								<SocialLoginBtns />
								<div className="text-center text-sm">
									Don&apos;t have an account?{' '}
									<a
										href="/auth/signup"
										className="underline underline-offset-4"
									>
										Sign up
									</a>
								</div>
							</div>
						</form>
						<div className="relative hidden bg-muted md:block">
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
				<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
					By clicking continue, you agree to our{' '}
					<a
						href={process.env.TERMS_PAGE || '#'}
						target="_blank"
						rel="noreferrer"
					>
						Terms of Service
					</a>{' '}
					and{' '}
					<Link
						href={process.env.POLICIES_PAGE || '#'}
						target="_blank"
						rel="noreferrer"
					>
						Privacy Policy
					</Link>
					.
				</div>
			</div>
		</OnlyClient>
	);
}
