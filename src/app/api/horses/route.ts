import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, successResponse } from '@/lib/api-helpers';
import { horseCreateSchema } from '@/lib/validations';
import { Errors } from '@/lib/errors';

export const dynamic = 'force-dynamic';

// GET /api/horses - List horses
export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const yardId = searchParams.get('yardId');
  const assignedGroom = searchParams.get('assignedGroom');
  const search = searchParams.get('search');

  console.log('GET /api/horses called with:', { yardId, assignedGroom, search });

  if (!yardId) {
    Errors.badRequest('yardId is required');
  }

  const horses = await prisma.horse.findMany({
    where: {
      yardId: yardId as string,
      assignedGroom: assignedGroom || undefined,
      name: search
        ? {
            contains: search,
          }
        : undefined,
    },
    include: {
      groom: {
        select: { id: true, name: true, email: true },
      },
      owner: {
        select: { id: true, name: true, email: true },
      },
      vaccinations: true,
      _count: {
        select: { notes: true, tasks: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  console.log('Found horses:', horses);

  return successResponse({ horses, total: horses.length });
});

// POST /api/horses - Create horse
export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const data = horseCreateSchema.parse(body);

  // TODO: Verify user is YARD_MANAGER and belongs to this yard

  if (!data.yardId) {
    Errors.badRequest('yardId is required');
  }

  // Convert empty strings to null for optional fields
  const createData = {
    ...data,
    yardId: data.yardId,
    assignedGroom: data.assignedGroom || null,
    ownerId: data.ownerId || null,
  };

  const horse = await prisma.horse.create({
    data: createData,
    include: {
      groom: {
        select: { id: true, name: true },
      },
      owner: {
        select: { id: true, name: true },
      },
    },
  });

  return successResponse(horse, 201);
});
