import { prisma } from "@/prisma/prisma";
import multer from "multer";
import { getToken } from "next-auth/jwt";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const dir = path.join(process.cwd(), "public/carousels");
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};

const upload = multer({ storage, fileFilter });

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    await runMiddleware(req, res, upload.single("image"));

    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if (!token) {
    //   console.error("Token not found or invalid");
    //   return res.status(401).json({ message: "Tidak Diizinkan" });
    // }

    // if (token.role !== "ADMIN") {
    //   console.error("User is not an admin");
    //   return res.status(401).json({ message: "Tidak Diizinkan" });
    // }

    if (!req.file) {
      console.error("File not found in the request");
      return res.status(400).json({ message: "File is required" });
    }

    const { filename } = req.file;
    const { title, color } = req.body;

    const newCarousel = await prisma.carousel.create({
      data: { image: `/carousels/${filename}`, title, color },
    });

    res.status(200).json(newCarousel);
  } catch (error) {
    console.error("Error occurred:", error); // Log the error for debugging
    res.status(500).json({ message: `Error: ${error.message}` });
  }
}
