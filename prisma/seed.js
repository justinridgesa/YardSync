import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a test yard
  const yard = await prisma.yard.create({
    data: {
      name: 'Green Pastures Yard',
      location: 'Devon, UK',
    },
  });

  console.log(`Created yard: ${yard.name}`);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'justinridgesa@gmail.com',
      name: 'Justin Ridge',
      password: 'ircftpie',
      role: 'ADMINISTRATOR',
      yardId: yard.id,
    },
  });

  console.log(`Created admin user: ${admin.email}`);

  // Create managers
  const manager1 = await prisma.user.create({
    data: {
      email: 'manager@example.com',
      name: 'John Manager',
      password: 'hashed_password_here', // In real app, hash this
      role: 'YARD_MANAGER',
      yardId: yard.id,
    },
  });

  // Create grooms
  const groom1 = await prisma.user.create({
    data: {
      email: 'sarah@example.com',
      name: 'Sarah Groom',
      password: 'hashed_password_here',
      role: 'GROOM',
      yardId: yard.id,
    },
  });

  const groom2 = await prisma.user.create({
    data: {
      email: 'tom@example.com',
      name: 'Tom Groom',
      password: 'hashed_password_here',
      role: 'GROOM',
      yardId: yard.id,
    },
  });

  // Create sample horses
  const horses = await Promise.all([
    prisma.horse.create({
      data: {
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
    prisma.horse.create({
      data: {
        yardId: yard.id,
        name: 'Midnight Star',
        age: 8,
        breed: 'Arab',
        passportNumber: '789012',
        assignedGroom: groom2.id,
        feedPlan: '2 scoops morning, 2 evening',
      },
    }),
    prisma.horse.create({
      data: {
        yardId: yard.id,
        name: 'Bella',
        age: 3,
        breed: 'Quarter Horse',
        passportNumber: '345678',
        assignedGroom: groom1.id,
      },
    }),
  ]);

  console.log(`Created ${horses.length} horses`);

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
