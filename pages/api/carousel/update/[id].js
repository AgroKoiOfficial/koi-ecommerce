import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

const upload = multer({
  dest: "public/carousels/",
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only images with jpeg, jpg, png, or webp format are allowed!"));
    }
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/carousels/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const carouselId = req.query.id;

    upload.single("image")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(500).json({ error: "Failed to upload image" });
      } else if (err) {
        console.error("Unknown error:", err);
        return res.status(500).json({ error: "An unknown error occurred" });
      }

      const { title, color } = req.body;

      try {
        let imagePath = null;

        if (req.file) {
          const existingCarousel = await prisma.carousel.findUnique({
            where: { id: carouselId },
            select: { image: true },
          });

          if (existingCarousel && existingCarousel.image) {
            const oldImagePath = path.join("public", existingCarousel.image);
            await fs.unlink(oldImagePath);
          }

          imagePath = `/carousels/${req.file.filename}`;
        }

        const updatedData = {};
        if (title) updatedData.title = title;
        if (color) updatedData.color = color;
        if (imagePath) updatedData.image = imagePath;

        const updatedCarousel = await prisma.carousel.update({
          where: { id: carouselId },
          data: updatedData,
        });

        res.status(200).json(updatedCarousel);
      } catch (error) {
        console.error("Error updating carousel:", error);
        res.status(500).json({ error: "Failed to update carousel" });
      }
    });
  } catch (error) {
    console.error("Error in update middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
