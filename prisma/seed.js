import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  const adminEmail = 'admin@gooddogmail.club';
  const demoEmail = 'buddy-parent@example.com';
  const adminPassword = await bcrypt.hash('admin123', 10);
  const demoPassword = await bcrypt.hash('buddy123', 10);

  const adventure = await prisma.monthlyAdventure.upsert({
    where: { monthKey: '2025-01' },
    update: {},
    create: {
      monthKey: '2025-01',
      title: 'Welcome to the Pack',
      themeDescription: 'A cozy welcome mission to start your friendship ritual.',
      messageToDogTemplate: 'Hi {{dogName}}! We are so happy you are here. Grab your human and start this month\'s cozy adventure.',
      missionTitle: 'Good Dog Challenge',
      missionSteps: [
        'Find the coziest spot together.',
        'Share a treat and a compliment.',
        'Teach or practice one new trick.',
        'Take a short mindful walk and notice smells.',
        'Pose for a keepsake photo with your letter.'
      ],
      funFeatureType: 'HOROSCOPE',
      funFeatureContent: {
        blurb: 'Buddy will have a month filled with surprise naps and loyal sidekick moments. Expect extra tail wags when the mail arrives.'
      },
      isActive: true
    }
  });

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      name: 'Mailroom Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
      addressLine1: '1 Mailroom Way',
      city: 'Pawnee',
      state: 'IN',
      postalCode: '46001'
    }
  });

  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      name: 'Buddy\'s Human',
      passwordHash: demoPassword,
      role: 'MEMBER',
      addressLine1: '123 Cozy Lane',
      city: 'Tailtown',
      state: 'CA',
      postalCode: '90210',
      subscription: {
        create: {
          plan: 'GOOD_DOG_9_99',
          status: 'ACTIVE',
          stripeCustomerId: 'cus_demo',
          stripeSubscriptionId: 'sub_demo'
        }
      },
      dogs: {
        create: {
          name: 'Buddy',
          birthMonth: 3
        }
      }
    },
    include: { dogs: true }
  });

  const dog = demoUser.dogs[0];
  await prisma.adventureCompletion.upsert({
    where: { dogId_monthlyAdventureId: { dogId: dog.id, monthlyAdventureId: adventure.id } },
    update: {},
    create: {
      dogId: dog.id,
      monthlyAdventureId: adventure.id,
      stepsCompleted: [],
      isComplete: false
    }
  });

  console.log('Seeded admin, demo user, and adventure');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
