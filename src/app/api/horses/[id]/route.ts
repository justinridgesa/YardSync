import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, successResponse } from '@/lib/api-helpers';
import { Errors } from '@/lib/errors';

// GET /api/horses/:horseId - Get horse details
export const GET = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const horseId = pathname.split('/').pop();

  if (!horseId) {
    Errors.badRequest('Horse ID is required');
  }

  const horse = await prisma.horse.findUnique({
    where: { id: horseId },
    include: {
      yard: {
        select: { id: true, name: true },
      },
      groom: {
        select: { id: true, name: true, email: true },
      },
      owner: {
        select: { id: true, name: true, email: true },
      },
      vaccinations: {
        orderBy: { createdAt: 'desc' },
      },
      medicalHistory: {
        orderBy: { date: 'desc' },
        include: {
          attachments: true,
        },
      },
      notes: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          author: {
            select: { id: true, name: true },
          },
          attachments: true,
        },
      },
      tasks: {
        where: { status: 'PENDING' },
        take: 5,
      },
    },
  });

  if (!horse) {
    Errors.notFound('Horse');
  }

  return successResponse(horse);
});

// PATCH /api/horses/:horseId - Update horse
export const PATCH = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const horseId = pathname.split('/').pop();
  const body = await req.json();

  if (!horseId) {
    Errors.badRequest('Horse ID is required');
  }

  // TODO: Verify user is YARD_MANAGER

  // Only include valid fields in the update
  const validFields: Record<string, unknown> = {};
  const allowedFields = ['name', 'breed', 'age', 'sex', 'color', 'passportNumber', 'assignedGroom', 'ownerId', 'feedPlan', 'supplements', 'activeMedication', 'workSchedule'];
  
  for (const field of allowedFields) {
    if (field in body && (body as Record<string, unknown>)[field] !== undefined) {
      validFields[field] = (body as Record<string, unknown>)[field];
    }
  }

  const horse = await prisma.horse.update({
    where: { id: horseId },
    data: validFields,
    include: {
      groom: {
        select: { id: true, name: true },
      },
      owner: {
        select: { id: true, name: true },
      },
    },
  });

  return successResponse(horse);
});

// DELETE /api/horses/:horseId - Delete horse
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const horseId = pathname.split('/').pop();

  if (!horseId) {
    Errors.badRequest('Horse ID is required');
  }

  // TODO: Verify user is YARD_MANAGER

  await prisma.horse.delete({
    where: { id: horseId },
  });

  return successResponse({ success: true });
});
