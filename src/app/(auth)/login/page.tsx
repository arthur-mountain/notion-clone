'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import Loader from '@/components/Global/Loader';
import { formSchema, type FormSchemaType } from './form-schema';
import { actionLoginUser } from './actions';

const LoginPage = () => {
	const router = useRouter();
	const [submitError, setSubmitError] = useState('');

	const form = useForm<FormSchemaType>({
		mode: 'onChange',
		resolver: zodResolver(formSchema),
		defaultValues: { email: '', password: '' },
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit: SubmitHandler<FormSchemaType> = async (formData) => {
		const { error } = await actionLoginUser(formData);
		if (error) {
			form.reset();
			setSubmitError(error.message);
			return;
		}
		router.replace('/dashboard');
	};

	return (
		<Form {...form}>
			<form
				onChange={() => {
					if (submitError) setSubmitError('');
				}}
				onSubmit={form.handleSubmit(onSubmit)}
				className='w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col'
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
				{submitError && <FormMessage>{submitError}</FormMessage>}
				<Button
					type='submit'
					className='w-full p-6'
					size='lg'
					disabled={isLoading}
				>
					{!isLoading ? 'Login' : <Loader />}
				</Button>
				<span className='self-center'>
					Don`t have an account?
					<Link href='/sign-up' className='text-primary ml-2'>
						Sign Up
					</Link>
				</span>
			</form>
		</Form>
	);
};

export default LoginPage;
