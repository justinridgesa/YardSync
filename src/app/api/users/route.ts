import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('yard_sync_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the current user's yard
    const currentUser = await prisma.user.findUnique({
      where: { id: token },
      select: { yardId: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch all users in the same yard
    const users = await prisma.user.findMany({
      where: { yardId: currentUser.yardId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(
      {
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Fetch users error:', errorMessage, error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('yard_sync_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the current user's yard
    const currentUser = await prisma.user.findUnique({
      where: { id: token },
      select: { yardId: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, name, password, role } = body;

    // Validate required fields
    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { error: 'Email, name, password, and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password,
        role,
        yardId: currentUser.yardId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Create user error:', errorMessage, error);
    return NextResponse.json(
      { error: 'Failed to create user', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('yard_sync_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the current user's yard
    const currentUser = await prisma.user.findUnique({
      where: { id: token },
      select: { yardId: true, id: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse request body for userId to delete
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Prevent deleting yourself
    if (userId === currentUser.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Verify the user to delete belongs to the same yard
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      select: { yardId: true },
    });

    if (!userToDelete || userToDelete.yardId !== currentUser.yardId) {
      return NextResponse.json(
        { error: 'User not found or does not belong to your yard' },
        { status: 404 }
      );
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Delete user error:', errorMessage, error);
    return NextResponse.json(
      { error: 'Failed to delete user', details: errorMessage },
      { status: 500 }
    );
  }
}
