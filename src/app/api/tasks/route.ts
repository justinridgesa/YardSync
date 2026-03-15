import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, successResponse } from '@/lib/api-helpers';
import { taskCreateSchema } from '@/lib/validations';
import { Errors } from '@/lib/errors';

export const dynamic = 'force-dynamic';

// GET /api/tasks - List tasks
export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const yardId = searchParams.get('yardId');
  const horseId = searchParams.get('horseId');
  const date = searchParams.get('date');
  const status = searchParams.get('status');

  if (!yardId) {
    Errors.badRequest('yardId is required');
  }

  const tasks = await prisma.task.findMany({
    where: {
      yardId: yardId as string,
      horseId: horseId || undefined,
      status: (status as string) || undefined,
      dueDate: date
        ? {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
          }
        : undefined,
    },
    include: {
      horse: {
        select: { id: true, name: true },
      },
      createdBy: {
        select: { id: true, name: true },
      },
      completions: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
    },
    orderBy: { dueDate: 'asc' },
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
    pending: tasks.filter((t) => t.status === 'PENDING').length,
    overdue: tasks.filter((t) => t.status === 'OVERDUE').length,
  };

  return successResponse({ tasks, stats });
});

// POST /api/tasks - Create task
export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const data = taskCreateSchema.parse(body);

  // TODO: Verify user is YARD_MANAGER

  const task = await prisma.task.create({
    data: {
      ...data,
      createdById: body.createdById || '1', // TODO: Get from session
      dueDate: typeof data.dueDate === 'string'
        ? new Date(data.dueDate)
        : data.dueDate,
    },
    include: {
      horse: {
        select: { id: true, name: true },
      },
      createdBy: {
        select: { id: true, name: true },
      },
    },
  });

  return successResponse(task, 201);
});
