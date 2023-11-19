'use client';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { SignUpFormSchema } from '@/lib/form-schema/sign-up';
import { actionSignUpUser } from '@/lib/server-actions/auth-action/sign-up';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Loader from '@/components/global/Loader';

const SignUpPage = () => {
	const searchParams = useSearchParams();
	const [submitError, setSubmitError] = useState('');
	const [confirmation, setConfirmation] = useState(false);

	const codeExchangeError = useMemo(
		() => (searchParams ? searchParams.get('error_description') : ''),
		[searchParams],
	);

	const confirmationAndErrorStyles = useMemo(
		() =>
			cn(
				'bg-primary',
				codeExchangeError && 'bg-red-500/10 border-red-500/50 text-red-700',
			),
		[codeExchangeError],
	);

	const form = useForm<z.infer<typeof SignUpFormSchema>>({
		mode: 'onChange',
		resolver: zodResolver(SignUpFormSchema),
		defaultValues: { email: '', password: '', confirmPassword: '' },
	});
	const isLoading = form.formState.isSubmitting;

	const onSubmit = async ({
		email,
		password,
	}: z.infer<typeof SignUpFormSchema>) => {
		const { error } = await actionSignUpUser({ email, password });
		if (error) {
			form.reset();
			setSubmitError(error.message);
			return;
		}
		setConfirmation(true);
	};

	return (
		<Form {...form}>
			<form
				onChange={() => {
					if (submitError) setSubmitError('');
				}}
				onSubmit={form.handleSubmit(onSubmit)}
				className='w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col dark'
			>
				<Link href='/' className='w-full flex justify-left items-center'>
					<Image
						src='/cypress-logo.svg'
						alt='cypress Logo'
						width={50}
						height={50}
					/>
					<span className='font-semibold dark:text-white text-4xl first-letter:ml-2'>
						cypress.
					</span>
				</Link>
				<FormDescription className='text-foreground/60'>
					An all-In-One Collaboration and Productivity Platform
				</FormDescription>
				{!confirmation && !codeExchangeError && (
					<>
						<FormField
							disabled={isLoading}
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input type='email' placeholder='Email' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							disabled={isLoading}
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input type='password' placeholder='Password' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							disabled={isLoading}
							control={form.control}
							name='confirmPassword'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type='password'
											placeholder='Confirm Password'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit' className='w-full p-6' disabled={isLoading}>
							{!isLoading ? 'Create Account' : <Loader />}
						</Button>
					</>
				)}
				{submitError && <FormMessage>{submitError}</FormMessage>}
				<span className='self-container'>
					Already have an account?
					<Link href='/login' className='text-primary ml-2'>
						Login
					</Link>
				</span>
				{(confirmation || codeExchangeError) && (
					<>
						<Alert className={confirmationAndErrorStyles}>
							<AlertTitle>
								{codeExchangeError ? 'Invalid Link' : 'Check your email.'}
							</AlertTitle>
							<AlertDescription>
								{codeExchangeError || 'An email confirmation has been sent.'}
							</AlertDescription>
						</Alert>
					</>
				)}
			</form>
		</Form>
	);
};

export default SignUpPage;
