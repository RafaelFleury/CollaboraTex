import { z } from 'zod';

// Mensagens de erro em português
export const documentErrorMessages = {
  title: {
    required: 'O título é obrigatório',
    tooShort: 'O título deve conter pelo menos 3 caracteres',
    tooLong: 'O título não pode exceder 100 caracteres',
    invalid: 'O título contém caracteres inválidos'
  }
};

// Esquema de validação para título do documento
export const documentTitleSchema = z
  .string()
  .min(1, { message: documentErrorMessages.title.required })
  .min(3, { message: documentErrorMessages.title.tooShort })
  .max(100, { message: documentErrorMessages.title.tooLong })
  .refine(
    (value) => /^[a-zA-Z0-9\sáàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ.,\-_:;()&]+$/.test(value),
    { message: documentErrorMessages.title.invalid }
  );

// Esquema de validação para o formulário de criação de documento
export const createDocumentSchema = z.object({
  title: documentTitleSchema
});

// Tipo para os campos do formulário de criação de documento
export type CreateDocumentFormValues = z.infer<typeof createDocumentSchema>; 