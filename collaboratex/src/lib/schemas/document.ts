import { z } from 'zod';

// Error messages in English
export const documentErrorMessages = {
  title: {
    required: 'Title is required',
    tooShort: 'Title must be at least 3 characters',
    tooLong: 'Title cannot exceed 100 characters',
    invalid: 'Title contains invalid characters'
  }
};

// Validation schema for document title
export const documentTitleSchema = z
  .string()
  .min(1, { message: documentErrorMessages.title.required })
  .min(3, { message: documentErrorMessages.title.tooShort })
  .max(100, { message: documentErrorMessages.title.tooLong })
  .refine(
    (value) => /^[a-zA-Z0-9\sáàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ.,\-_:;()&]+$/.test(value),
    { message: documentErrorMessages.title.invalid }
  );

// Validation schema for document creation form
export const createDocumentSchema = z.object({
  title: documentTitleSchema
});

// Type for document creation form fields
export type CreateDocumentFormValues = z.infer<typeof createDocumentSchema>; 