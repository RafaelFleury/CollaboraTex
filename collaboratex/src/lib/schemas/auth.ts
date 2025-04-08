import { z } from 'zod';

// Error messages in English
export const authErrorMessages = {
  email: {
    required: 'Email is required',
    invalid: 'Invalid email format',
  },
  password: {
    required: 'Password is required',
    tooShort: 'Password must be at least 8 characters',
  },
};

// Validation schema for email
export const emailSchema = z
  .string()
  .min(1, { message: authErrorMessages.email.required })
  .email({ message: authErrorMessages.email.invalid });

// Validation schema for password
export const passwordSchema = z
  .string()
  .min(1, { message: authErrorMessages.password.required })
  .min(8, { message: authErrorMessages.password.tooShort });

// Validation schema for login form
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Validation schema for registration form
export const registerSchema = loginSchema;

// Type for login/registration form fields
export type AuthFormValues = z.infer<typeof loginSchema>; 