import { z } from 'zod';

// Mensagens de erro em português
export const authErrorMessages = {
  email: {
    required: 'Email é obrigatório',
    invalid: 'Formato de email inválido',
  },
  password: {
    required: 'Senha é obrigatória',
    tooShort: 'Senha deve ter pelo menos 8 caracteres',
  },
};

// Esquema de validação para o email
export const emailSchema = z
  .string()
  .min(1, { message: authErrorMessages.email.required })
  .email({ message: authErrorMessages.email.invalid });

// Esquema de validação para a senha
export const passwordSchema = z
  .string()
  .min(1, { message: authErrorMessages.password.required })
  .min(8, { message: authErrorMessages.password.tooShort });

// Esquema de validação para o formulário de login
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Esquema de validação para o formulário de registro
export const registerSchema = loginSchema;

// Tipo para os campos do formulário de login/registro
export type AuthFormValues = z.infer<typeof loginSchema>; 