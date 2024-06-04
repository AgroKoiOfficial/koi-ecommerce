import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import multer from "multer";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === "image") {
        cb(null, "public/images/");
      } else if (file.fieldname === "video") {
        cb(null, "public/videos/");
      } else {
        cb(new Error("Invalid field name"), false);
      }
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  fileFilter: function (req, file, cb) {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const allowedVideoTypes = [
      "video/mp4",
      "video/mpeg",
      "video/ogg",
      "video/webm",
    ];

    if (
      file.fieldname === "image" &&
      allowedImageTypes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else if (
      file.fieldname === "video" &&
      allowedVideoTypes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new Error("File type not supported"), false);
    }
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

export default async function handler(req, res) {
  const productId = req.query.id;
  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error(err);
        return res.status(500).json({ error: "Failed to upload media" });
      } else if (err) {
        console.error(err);
        return res.status(500).json({ error: "An unknown error occurred" });
      }

      const { id, name, price, stock, description, categoryId } = req.body;
      const { image, video } = req.files;

      const updateData = {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        description,
        category: {
          connect: { id: categoryId },
        },
      };

      if (image && image.length > 0) {
        const existingProduct = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (existingProduct.image) {
          fs.unlinkSync(`public${existingProduct.image}`);
        }

        updateData.image = `/images/${image[0].filename}`;
      }

      // Periksa apakah ada file video yang diunggah
      if (video && video.length > 0) {
        const existingProduct = await prisma.product.findUnique({
          where: { id: productId },
        });

        // Hapus file video lama jika ada
        if (existingProduct.video) {
          fs.unlinkSync(`public${existingProduct.video}`);
        }

        updateData.video = `/videos/${video[0].filename}`;
      }

      const product = await prisma.product.update({
        where: { id: productId },
        data: updateData,
      });

      res.status(200).json(product);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
}
