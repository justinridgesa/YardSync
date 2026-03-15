import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, successResponse } from '@/lib/api-helpers';
import { Errors } from '@/lib/errors';

// POST /api/horses/:id/tasks - Create task
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const horseId = pathname.split('/')[3];
  const body = await req.json();

  if (!horseId) {
    Errors.badRequest('Horse ID is required');
  }

  const task = await prisma.task.create({
    data: {
      horseId,
      title: body.title,
      description: body.description,
      category: body.category || 'DAILY_CARE',
      frequency: body.frequency || 'DAILY',
      status: body.status || 'PENDING',
      assignedTo: body.assignedTo,
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
      title: body.title,
      description: body.description,
      category: body.category,
      frequency: body.frequency,
      status: body.status,
      assignedTo: body.assignedTo,
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
