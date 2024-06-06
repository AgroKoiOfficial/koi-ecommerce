import { prisma } from "@/prisma/prisma";
import multer from "multer";
import { getToken } from "next-auth/jwt";
import fs from "fs/promises";

const upload = multer({ dest: "public/carousels/" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).end();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (token.role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to upload image" });
      }

      const { id, title, color } = req.body;
      let image = req.file ? `/uploads/${req.file.filename}` : undefined;

      if (image) {
        const carousel = await prisma.carousel.findUnique({ where: { id } });
        if (carousel && carousel.image) {
          await fs.unlink(`public${carousel.image}`);
        }
      }

      const updatedCarousel = await prisma.carousel.update({
        where: { id },
        data: { title, color, image },
      });

      res.status(200).json(updatedCarousel);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
