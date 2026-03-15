import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, successResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

// GET /api/dashboard/overview - Manager dashboard
export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const yardId = searchParams.get('yardId');

  if (!yardId) {
    throw new Error('yardId is required');
  }

  // Get today's compliance
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasksToday = await prisma.task.findMany({
    where: {
      yardId,
      dueDate: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  const completedToday = tasksToday.filter((t) => t.status === 'COMPLETED')
    .length;
  const compliancePercentage =
    tasksToday.length > 0
      ? Math.round((completedToday / tasksToday.length) * 100)
      : 0;

  // Get alert horses
  const alertHorses = await prisma.horse.findMany({
    where: {
      yardId,
      currentAlertLevel: { in: ['AMBER', 'RED'] },
    },
    select: {
      id: true,
      name: true,
      currentAlertLevel: true,
      medicationOverdue: true,
    },
  });

  // Get horses on medication
  const horsesOnMedication = await prisma.horse.findMany({
    where: {
      yardId,
      activeMedication: { not: null },
    },
    select: { id: true, name: true, activeMedication: true },
  });

  // Get recent health notes
  const recentHealthNotes = await prisma.note.findMany({
    where: {
      yardId,
      tag: 'HEALTH',
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    include: {
      horse: { select: { id: true, name: true } },
      author: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return successResponse({
    todayCompliance: {
      total: tasksToday.length,
      completed: completedToday,
      percentage: compliancePercentage,
    },
    alertHorses,
    horsesOnMedicationCount: horsesOnMedication.length,
    recentHealthNotes,
  });
});
