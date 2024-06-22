import { PrismaClient } from '@prisma/client';
import { getToken } from "next-auth/jwt";
import { uploadMedia } from "@/middleware/uploadMedia";
import multer from "multer"

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    uploadMedia(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error(err);
        return res.status(500).json({ error: "Failed to upload media" });
      } else if (err) {
      
        console.error(err);
        return res.status(500).json({ error: "An unknown error occurred" });
      }

      const { slug, name, price, stock, description, categoryId } = req.body;
      const { image, video } = req.files;

      if (!name || !price || !stock || !description || !categoryId) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const numericFields = ['price', 'stock'];
      for (const field of numericFields) {
        if (isNaN(parseFloat(req.body[field]))) {
          return res.status(400).json({ error: `${field} must be a valid number` });
        }
      }

      const productData = {
        slug,
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        description,
        category: {
          connect: { id: categoryId },
        },
        image: image ? `/images/${image[0].filename}` : null,
        video: video ? `/videos/${video[0].filename}` : null,
      };

      const product = await prisma.product.create({
        data: productData,
      });

      res.status(201).json(product);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create product" });
  }
}
