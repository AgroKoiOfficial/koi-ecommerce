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

    // Finding the next service to access
    let serviceToAccess = activeServices.find(service => service.lastAccessed === null || service.lastAccessed.toISOString() !== device);

    if (!serviceToAccess) {
      serviceToAccess = activeServices[0];
    }

    // Update the lastAccessed for the selected service
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
