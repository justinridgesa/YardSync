import { prisma } from '@/lib/db';
import { withErrorHandling, successResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

// GET /api/yards - List yards
export const GET = withErrorHandling(async () => {
  console.log('GET /api/yards called');
  const yards = await prisma.yard.findMany({
    orderBy: { name: 'asc' },
  });
  console.log('Found yards:', yards);
  
  return successResponse({ yards, total: yards.length });
});
