import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to generate seeded random number
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const activeServices = await prisma.customerService.findMany({
      where: { active: true },
      orderBy: { lastAccessed: 'asc' },
    });

    if (activeServices.length === 0) {
      return res.status(404).json({ message: 'No active customer service available' });
    }

    // Seed based on current time
    const seed = new Date().getTime();
    
    // Use seeded random number
    const randomIndex = Math.floor(seededRandom(seed) * activeServices.length);
    const serviceToAccess = activeServices[randomIndex];

    const updatedService = await prisma.customerService.update({
      where: { id: serviceToAccess.id },
      data: {
        lastAccessed: new Date(),
      },
    });

    return res.status(200).json(updatedService);
  } catch (error) {
    console.error('Error fetching customer service by device:', error);
    return res.status(500).json({ message: 'Failed to fetch customer service' });
  } finally {
    await prisma.$disconnect();
  }
}
