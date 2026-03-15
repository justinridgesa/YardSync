import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, successResponse } from '@/lib/api-helpers';
import { Errors } from '@/lib/errors';

// PATCH /api/yards/[id]/team/[userId] - Update team member
export const PATCH = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/')[3];
  const userId = pathname.split('/')[5];
  const body = await req.json();

  if (!id || !userId) {
    Errors.badRequest('Yard ID and User ID are required');
  }

  // Verify user belongs to this yard
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      yardId: id,
    },
  });

  if (!user) {
    Errors.notFound('Team member');
  }

  const { name, role } = body;

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name }),
      ...(role && { role }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return successResponse({ member: updatedUser });
});

// DELETE /api/yards/[id]/team/[userId] - Remove team member
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/')[3];
  const userId = pathname.split('/')[5];

  if (!id || !userId) {
    Errors.badRequest('Yard ID and User ID are required');
  }

  // Verify user belongs to this yard
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      yardId: id,
    },
  });

  if (!user) {
    Errors.notFound('Team member');
  }

  // Prevent deleting the last manager
  const managerCount = await prisma.user.count({
    where: {
      yardId: id,
      role: 'YARD_MANAGER',
    },
  });

  if (user!.role === 'YARD_MANAGER' && managerCount <= 1) {
    Errors.forbidden();
  }

  // Delete user
  await prisma.user.delete({
    where: { id: userId },
  });

  return successResponse({ message: 'Team member removed successfully' });
});
