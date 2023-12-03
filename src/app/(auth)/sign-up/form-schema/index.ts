import { z } from 'zod';

/* Base of sign up schema */
const signUpSchema = z.object({
	email: z.string().describe('Email').email({ message: 'Invalid Email' }),
	password: z
		.string()
		.describe('Password')
		.min(6, 'Password must be minimum 6 characters'),
	confirmPassword: z
		.string()
		.describe('Confirm Password')
		.min(6, 'Password must be minimum 6 characters'),
});

/* Sign up form schema refine with validation */
export const signUpFormSchema = signUpSchema.refine(
	(data) => data.password === data.confirmPassword,
	{
		message: "Passwords don't match.",
		path: ['confirmPassword'],
	},
);
export type SignUpFormSchemaType = z.infer<typeof signUpFormSchema>;

/* Params of sign up server action */
const signUpActionParam = signUpSchema.omit({ confirmPassword: true });
export type SignUpActionParamType = z.infer<typeof signUpActionParam>;
