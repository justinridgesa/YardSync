import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

interface UpdateUserData {
  name: string;
  contactNumber?: string;
  role?: string;
}

export async function PUT(request: NextRequest) {
  console.log('🔵 [API] PUT /api/users/profile called');
  
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('yard_sync_token')?.value;

    console.log('🔵 [API] Token exists:', !!token);

    if (!token) {
      console.error('❌ [API] No authentication token found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log('🔵 [API] Request body:', body);
    const { firstName, lastName, contactNumber, permissionLevel, userId } = body;

    // Validate required fields
    if (!firstName || !lastName) {
      console.error('❌ [API] Missing required fields:', { firstName, lastName });
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    // Use provided userId or default to current user (token)
    const targetUserId = userId || token;
    console.log('🔵 [API] Target User ID:', targetUserId);

    // Build update data
    const updateData: UpdateUserData = {
      name: `${firstName} ${lastName}`,
    };

    if (contactNumber) {
      updateData.contactNumber = contactNumber;
    }

    if (permissionLevel) {
      updateData.role = permissionLevel;
    }

    console.log('🔵 [API] Update data:', updateData);

    // Update user in database
    console.log('🔵 [API] Attempting to update user in database...');
    const user = await prisma.user.update({
      where: { id: targetUserId },
      data: updateData,
    });
    console.log('✅ [API] User updated successfully:', user);

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          contactNumber: user.contactNumber || null,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ [API] Profile update error:', errorMessage, error);
    return NextResponse.json(
      { error: 'Failed to update profile', details: errorMessage },
      { status: 500 }
    );
  }
}
