import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    const categoryId = req.query.id;
  
    if (req.method !== 'PUT' && req.method !== 'PATCH') {
      return res.status(405).end(); 
    }
  
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    if (token.role !== 'ADMIN') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }
    
    const { name } = req.body;
  
    try {
      const updatedCategory = await prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          name,
        },
      });
      return res.status(200).json(updatedCategory);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }