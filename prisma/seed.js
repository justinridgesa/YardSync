import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Find or create a test yard
  let yard = await prisma.yard.findFirst({
    where: { name: 'Green Pastures Yard' },
  });

  if (!yard) {
    yard = await prisma.yard.create({
      data: {
        name: 'Green Pastures Yard',
        location: 'Devon, UK',
      },
    });
    console.log(`Created yard: ${yard.name}`);
  } else {
    console.log(`Found existing yard: ${yard.name}`);
  }

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: 'justinridgesa@gmail.com' },
    update: {},
    create: {
      email: 'justinridgesa@gmail.com',
      name: 'Justin Ridge',
      password: 'ircftpie',
      role: 'ADMINISTRATOR',
      yardId: yard.id,
    },
  });

  console.log(`Admin user: ${admin.email}`);

  // Create or update managers
  const manager1 = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      name: 'John Manager',
      password: 'hashed_password_here',
      role: 'YARD_MANAGER',
      yardId: yard.id,
    },
  });

  // Create or update grooms
  const groom1 = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      email: 'sarah@example.com',
      name: 'Sarah Groom',
      password: 'hashed_password_here',
      role: 'GROOM',
      yardId: yard.id,
    },
  });

  const groom2 = await prisma.user.upsert({
    where: { email: 'tom@example.com' },
    update: {},
    create: {
      email: 'tom@example.com',
      name: 'Tom Groom',
      password: 'hashed_password_here',
      role: 'GROOM',
      yardId: yard.id,
    },
  });

  // Create sample horses
  const horses = await Promise.all([
    prisma.horse.upsert({
      where: { passportNumber: '123456' },
      update: {},
      create: {
        yardId: yard.id,
        name: 'Equestrian',
        age: 5,
        breed: 'Thoroughbred',
        passportNumber: '123456',
        assignedGroom: groom1.id,
        feedPlan: '2 scoops morning, 3 evening',
        supplements: 'Biotin, Omega 3',
      },
    }),
    prisma.horse.upsert({
      where: { passportNumber: '789012' },
      update: {},
      create: {
        yardId: yard.id,
        name: 'Midnight Star',
        age: 8,
        breed: 'Arab',
        passportNumber: '789012',
        assignedGroom: groom2.id,
        feedPlan: '2 scoops morning, 2 evening',
      },
    }),
    prisma.horse.upsert({
      where: { passportNumber: '345678' },
      update: {},
      create: {
        yardId: yard.id,
        name: 'Bella',
        age: 3,
        breed: 'Quarter Horse',
        passportNumber: '345678',
        assignedGroom: groom1.id,
      },
    }),
  ]);

  console.log(`Horses ready: ${horses.length}`);

  // Create sample tasks
  const task = await prisma.task.create({
    data: {
      yardId: yard.id,
      name: 'AM Feed',
      category: 'FEEDING',
      frequency: 'DAILY',
      dueDate: new Date(),
      horseId: horses[0].id,
      createdById: manager1.id,
    },
  });

  console.log('Created sample task');

  // Create sample note
  const note = await prisma.note.create({
    data: {
      yardId: yard.id,
      horseId: horses[0].id,
      text: 'Horse looking good today',
      tag: 'HEALTH',
      createdBy: groom1.id,
    },
  });

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
