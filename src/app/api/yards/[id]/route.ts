import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, successResponse } from '@/lib/api-helpers';
import { Errors } from '@/lib/errors';

export const dynamic = 'force-dynamic';

// GET /api/yards/[id] - Get yard details
export const GET = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/')[3];

  if (!id) {
    Errors.badRequest('Yard ID is required');
  }

  const yard = await prisma.yard.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
      horses: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!yard) {
    Errors.notFound('Yard');
  }

  return successResponse({ yard });
});

// PATCH /api/yards/[id] - Update yard details
export const PATCH = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/')[3];
  const body = await req.json();

  if (!id) {
    Errors.badRequest('Yard ID is required');
  }

  const { name, location } = body;

  const yard = await prisma.yard.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(location && { location }),
    },
  });

  return successResponse({ yard });
});
