import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, successResponse } from '@/lib/api-helpers';
import { Errors } from '@/lib/errors';

export const dynamic = 'force-dynamic';

// POST /api/horses/:id/vaccinations - Create vaccination
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const horseId = pathname.split('/')[3];
  const body = await req.json();

  if (!horseId) {
    Errors.badRequest('Horse ID is required');
  }

  const vaccination = await prisma.vaccination.create({
    data: {
      horseId,
      name: body.name,
      lastDate: body.lastDate || body.date ? new Date(body.lastDate || body.date) : undefined,
      nextDueDate: body.nextDueDate || body.expiryDate ? new Date(body.nextDueDate || body.expiryDate) : new Date(),
      notes: body.notes,
    },
  });

  return successResponse(vaccination, 201);
});

// PATCH /api/horses/:id/vaccinations/:recordId - Update vaccination
export const PATCH = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const parts = pathname.split('/');
  const recordId = parts[parts.length - 1];
  const body = await req.json();

  if (!recordId) {
    Errors.badRequest('Record ID is required');
  }

  const vaccination = await prisma.vaccination.update({
    where: { id: recordId },
    data: {
      name: body.name,
      lastDate: body.lastDate || body.date ? new Date(body.lastDate || body.date) : undefined,
      nextDueDate: body.nextDueDate || body.expiryDate ? new Date(body.nextDueDate || body.expiryDate) : undefined,
      notes: body.notes,
    },
  });

  return successResponse(vaccination);
});

// DELETE /api/horses/:id/vaccinations/:recordId - Delete vaccination
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const parts = pathname.split('/');
  const recordId = parts[parts.length - 1];

  if (!recordId) {
    Errors.badRequest('Record ID is required');
  }

  await prisma.vaccination.delete({
    where: { id: recordId },
  });

  return successResponse({ success: true });
});
