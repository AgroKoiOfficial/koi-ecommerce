import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";
import multer from "multer";
import path from "path";

const upload = multer({
  dest: "public/carousels/",
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|avif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Only images with jpeg, jpg, png, or webp format are allowed!");
    }
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/carousels/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
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
          imagePath = `/carousels/${req.file.filename}`;
        }

        const carousel = await prisma.carousel.create({
          data: {
            title: title || null,
            color: color || null,
            image: imagePath,
          },
        });

        res.status(200).json(carousel);
      } catch (error) {
        console.error("Error saving to database:", error);
        res.status(500).json({ error: "Failed to save to database" });
      }
    });
  } catch (error) {
    console.error("Error in upload middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
