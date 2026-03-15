const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addUser() {
  try {
    console.log('Adding new user...');

    // Get the first yard (or you can specify a specific yard)
    const yard = await prisma.yard.findFirst();
    
    if (!yard) {
      console.error('No yard found in the system. Please create a yard first.');
      process.exit(1);
    }

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        email: 'justinridgesa@gmail.com',
        name: 'Justin Ridge',
        password: 'ircftpie',
        role: 'YARD_MANAGER',
        yardId: yard.id,
      },
    });

    console.log('✓ User created successfully!');
    console.log(`  Name: ${newUser.name}`);
    console.log(`  Email: ${newUser.email}`);
    console.log(`  Role: ${newUser.role}`);
    console.log(`  Yard: ${yard.name}`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('✗ Error: User with this email already exists');
    } else {
      console.error('✗ Error adding user:', error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addUser();
