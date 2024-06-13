import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const device = req.headers['user-agent'];

    const activeServices = await prisma.customerService.findMany({
      where: { active: true },
      orderBy: { lastAccessed: 'asc' },
    });

    if (activeServices.length === 0) {
      return res.status(404).json({ message: 'No active customer service available' });
    }

    let serviceToAccess = null;
    for (let i = 0; i < activeServices.length; i++) {
      const s = activeServices[i];
      if (s.lastAccessed === null || s.lastAccessed.toISOString() !== device) {
        serviceToAccess = s;
        break;
      }
    }

    if (!serviceToAccess) {
      serviceToAccess = activeServices[0];
    }

  
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
