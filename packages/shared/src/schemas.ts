import * as z from "zod/mini";

export const step0Schema = z.object({
  consent: z.boolean().check(z.refine((v) => v === true, 'Debes aceptar el aviso de privacidad')),
  firstName: z.string().check(z.minLength(1, 'Ingresa tu nombre')),
  lastName: z.string().check(z.minLength(1, 'Ingresa tus apellidos')),
  age: z.string().check(z.minLength(1, 'Selecciona tu edad')),
  phone: z.string().check(
    z.minLength(1, 'Ingresa tu teléfono'),
    z.regex(/^\d{10}$|^\+\d{7,15}$/, 'Ingresa un teléfono válido (10 dígitos o formato internacional)')
  ),
  email: z.string().check(
    z.minLength(1, 'Ingresa tu correo'),
    z.email('Correo electrónico inválido')
  ),
  password: z.string().check(
    z.minLength(1, 'Ingresa una contraseña'),
    z.superRefine((v, ctx) => {
      const issues = [];
      if (v.length < 8) issues.push('Mínimo 8 caracteres');
      if (!/[A-Z]/.test(v)) issues.push('Al menos una mayúscula');
      if (!/[a-z]/.test(v)) issues.push('Al menos una minúscula');
      if (!/[0-9]/.test(v)) issues.push('Al menos un número');
      if (issues.length > 0) ctx.addIssue({ code: 'custom', message: `Tu contraseña requiere:\n• ${issues.join('\n• ')}` });
    })
  ),
});

export const step1Schema = z.object({
  university: z.nullable(z.object({ id: z.number(), value: z.string(), alignment_id: z.number() })).check(
    z.refine((v) => v !== null, 'Selecciona tu universidad')
  ),
  career: z.string().check(z.minLength(1, 'Selecciona tu carrera')),
  studyLevel: z.string().check(z.minLength(1, 'Selecciona tu nivel de estudios')),
  englishLevel: z.string().check(z.minLength(1, 'Selecciona tu nivel de inglés')),
  referralSource: z.string().check(z.minLength(1, 'Selecciona cómo te enteraste')),
});

export const signupSchema = z.object({
  ...step0Schema.shape,
  ...step1Schema.shape,
});

export type Step0Errors = Partial<Record<keyof z.infer<typeof step0Schema>, string>>;
export type Step1Errors = Partial<Record<keyof z.infer<typeof step1Schema>, string>>;
