import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, successResponse } from '@/lib/api-helpers';
import { Errors } from '@/lib/errors';

export const dynamic = 'force-dynamic';

// GET /api/yards/[id]/team - List team members
export const GET = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/')[3];

  if (!id) {
    Errors.badRequest('Yard ID is required');
  }
  
  const members = await prisma.user.findMany({
    where: { yardId: id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return successResponse({ members, total: members.length });
});

// POST /api/yards/[id]/team - Add new team member
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/')[3];
  const body = await req.json();

  if (!id) {
    Errors.badRequest('Yard ID is required');
  }

  const { email, name, role } = body;

  if (!email || !name || !role) {
    Errors.badRequest('Missing required fields: email, name, role');
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser && existingUser.yardId === id) {
    Errors.conflict('User already exists in this yard');
  }

  if (existingUser) {
    Errors.conflict('User already exists in a different yard');
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      role,
      password: 'temp-password', // Should be hashed in production
      yardId: id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return successResponse({ member: user }, 201);
});
