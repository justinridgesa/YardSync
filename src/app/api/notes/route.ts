import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, successResponse } from '@/lib/api-helpers';
import { noteCreateSchema } from '@/lib/validations';
import { Errors } from '@/lib/errors';

export const dynamic = 'force-dynamic';

// GET /api/notes - Get notes for a horse
export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const horseId = searchParams.get('horseId');
  const tag = searchParams.get('tag');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  if (!horseId) {
    Errors.badRequest('horseId is required');
  }

  const notes = await prisma.note.findMany({
    where: {
      horseId: horseId as string,
      tag: (tag as string | null) || undefined,
    },
    include: {
      author: {
        select: { id: true, name: true },
      },
      attachments: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  const total = await prisma.note.count({
    where: {
      horseId: horseId as string,
      tag: (tag as string | null) || undefined,
    },
  });

  return successResponse({
    notes,
    total,
    hasMore: offset + limit < total,
  });
});

// POST /api/notes - Create note
export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const data = noteCreateSchema.parse(body);

  // TODO: Get userId from auth context
  const userId = 'user_123'; // Placeholder

  const note = await prisma.note.create({
    data: {
      ...data,
      createdBy: userId,
      yardId: 'yard_123', // Get from auth context
    },
    include: {
      author: {
        select: { id: true, name: true },
      },
      attachments: true,
      horse: {
        select: { id: true, name: true },
      },
    },
  });

  return successResponse(note, 201);
});
