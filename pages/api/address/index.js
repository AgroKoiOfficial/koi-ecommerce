import { prisma } from '@/prisma/prisma';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const addresses = await prisma.address.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
