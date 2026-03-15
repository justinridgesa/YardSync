import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, successResponse } from '@/lib/api-helpers';
import { Errors } from '@/lib/errors';

// POST /api/horses/:id/notes - Create note
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

  const note = await prisma.note.create({
    data: {
      horseId,
      yardId: horse!.yardId,
      text: body.text || body.content,
      createdBy: body.createdBy || '1', // TODO: Get from session
      tag: body.tag || 'GENERAL',
    },
  });

  return successResponse(note, 201);
});

// PATCH /api/horses/:id/notes/:recordId - Update note
export const PATCH = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const parts = pathname.split('/');
  const recordId = parts[parts.length - 1];
  const body = await req.json();

  if (!recordId) {
    Errors.badRequest('Record ID is required');
  }

  const note = await prisma.note.update({
    where: { id: recordId },
    data: {
      text: body.text || body.content,
      tag: body.tag,
    },
  });

  return successResponse(note);
});

// DELETE /api/horses/:id/notes/:recordId - Delete note
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const parts = pathname.split('/');
  const recordId = parts[parts.length - 1];

  if (!recordId) {
    Errors.badRequest('Record ID is required');
  }

  await prisma.note.delete({
    where: { id: recordId },
  });

  return successResponse({ success: true });
});
