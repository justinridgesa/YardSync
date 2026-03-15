import { z } from 'zod';

// User validation
export const userCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(['YARD_MANAGER', 'GROOM', 'OWNER']),
  yardId: z.string(),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Horse validation
export const horseCreateSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
  breed: z.string().optional(),
  sex: z.string().optional(),
  color: z.string().optional(),
  passportNumber: z.string().optional(),
  assignedGroom: z.string().optional().nullable(),
  ownerId: z.string().optional().nullable(),
  feedPlan: z.string().optional(),
  supplements: z.string().optional(),
  activeMedication: z.string().optional(),
  workSchedule: z.string().optional(),
  yardId: z.string(),
});

export const horseUpdateSchema = horseCreateSchema.partial();

// Task validation
export const taskCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.enum([
    'FEEDING',
    'TURNOUT',
    'MUCKING',
    'SUPPLEMENTS',
    'MEDICATION',
    'EXERCISE',
    'GROOMING',
    'HEALTH_CHECK',
    'YARD_MAINTENANCE',
    'OTHER',
  ]),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ONCE']),
  dueDate: z.string().or(z.date()),
  horseId: z.string().optional(),
  yardId: z.string(),
});

// Note validation
export const noteCreateSchema = z.object({
  horseId: z.string(),
  text: z.string().min(1).max(1000),
  tag: z.enum([
    'HEALTH',
    'TRAINING',
    'BEHAVIOR',
    'INJURY',
    'FEED',
    'EQUIPMENT',
    'BEHAVIOR_CHANGE',
    'OTHER',
  ]),
});

// Expense validation
export const expenseCreateSchema = z.object({
  date: z.string().or(z.date()),
  vendor: z.string().min(1),
  category: z.enum(['FEED', 'VET', 'FARRIER', 'BEDDING', 'LABOUR', 'EQUIPMENT', 'OTHER']),
  amount: z.number().positive(),
  notes: z.string().optional(),
  horseId: z.string().optional(),
  yardId: z.string(),
});

// Types derived from schemas
export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type HorseCreate = z.infer<typeof horseCreateSchema>;
export type HorseUpdate = z.infer<typeof horseUpdateSchema>;
export type TaskCreate = z.infer<typeof taskCreateSchema>;
export type NoteCreate = z.infer<typeof noteCreateSchema>;
export type ExpenseCreate = z.infer<typeof expenseCreateSchema>;
