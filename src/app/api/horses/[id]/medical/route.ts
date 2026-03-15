import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, successResponse } from '@/lib/api-helpers';
import { Errors } from '@/lib/errors';

export const dynamic = 'force-dynamic';

// POST /api/horses/:id/medical - Create medical history
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const horseId = pathname.split('/')[3];
  const body = await req.json();

  if (!horseId) {
    Errors.badRequest('Horse ID is required');
  }

  // Convert date string (YYYY-MM-DD) to full DateTime
  const dateStr = typeof body.date === 'string' ? body.date : new Date().toISOString().split('T')[0];
  const fullDate = new Date(`${dateStr}T00:00:00Z`);

  const record = await prisma.medicalHistory.create({
    data: {
      horseId,
      date: fullDate,
      condition: body.condition,
      treatment: body.treatment || null,
    },
    include: {
      attachments: true,
    },
  });

  return successResponse(record, 201);
});

// PATCH /api/horses/:id/medical/:recordId - Update medical history
export const PATCH = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const parts = pathname.split('/');
  const recordId = parts[parts.length - 1];
  const body = await req.json();

  if (!recordId) {
    Errors.badRequest('Record ID is required');
  }

  // Convert date string (YYYY-MM-DD) to full DateTime
  const dateStr = typeof body.date === 'string' ? body.date : new Date().toISOString().split('T')[0];
  const fullDate = new Date(`${dateStr}T00:00:00Z`);

  const record = await prisma.medicalHistory.update({
    where: { id: recordId },
    data: {
      date: fullDate,
      condition: body.condition,
      treatment: body.treatment || null,
    },
  });

  return successResponse(record);
});

// DELETE /api/horses/:id/medical/:recordId - Delete medical history
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const parts = pathname.split('/');
  const recordId = parts[parts.length - 1];

  if (!recordId) {
    Errors.badRequest('Record ID is required');
  }

  await prisma.medicalHistory.delete({
    where: { id: recordId },
  });

  return successResponse({ success: true });
});
