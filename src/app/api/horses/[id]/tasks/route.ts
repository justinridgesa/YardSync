import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, successResponse } from '@/lib/api-helpers';
import { Errors } from '@/lib/errors';

export const dynamic = 'force-dynamic';

// POST /api/horses/:id/tasks - Create task
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const horseId = pathname.split('/')[3];
  const body = await req.json();

  if (!horseId) {
    Errors.badRequest('Horse ID is required');
  }

  // Get horse to get yardId
  const horse = await prisma.horse.findUnique({
    where: { id: horseId },
    select: { yardId: true },
  });

  if (!horse) {
    Errors.notFound('Horse');
  }

  const task = await prisma.task.create({
    data: {
      horseId,
      yardId: horse!.yardId,
      name: body.name || body.title,
      description: body.description,
      category: body.category || 'OTHER',
      frequency: body.frequency || 'DAILY',
      dueDate: body.dueDate ? new Date(body.dueDate) : new Date(),
      status: body.status || 'PENDING',
      createdById: body.createdById || '1', // TODO: Get from session
    },
  });

  return successResponse(task, 201);
});

// PATCH /api/horses/:id/tasks/:recordId - Update task
export const PATCH = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const parts = pathname.split('/');
  const recordId = parts[parts.length - 1];
  const body = await req.json();

  if (!recordId) {
    Errors.badRequest('Record ID is required');
  }

  const task = await prisma.task.update({
    where: { id: recordId },
    data: {
      name: body.name || body.title,
      description: body.description,
      category: body.category,
      frequency: body.frequency,
      status: body.status,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    },
  });

  return successResponse(task);
});

// DELETE /api/horses/:id/tasks/:recordId - Delete task
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const parts = pathname.split('/');
  const recordId = parts[parts.length - 1];

  if (!recordId) {
    Errors.badRequest('Record ID is required');
  }

  await prisma.task.delete({
    where: { id: recordId },
  });

  return successResponse({ success: true });
});
