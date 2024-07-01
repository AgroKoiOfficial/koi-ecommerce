import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

const upload = multer({
  dest: "public/about/",
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|avif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Only images with jpeg, jpg, png, or webp format are allowed!");
    }
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/about/");
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
    const aboutId = req.query.id;

    upload.single("image")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(500).json({ error: "Failed to upload image" });
      } else if (err) {
        console.error("Unknown error:", err);
        return res.status(500).json({ error: "An unknown error occurred" });
      }

      const { title, content } = req.body;

      try {
        let imagePath = null;

        if (req.file) {
          const exitingAbout = await prisma.about.findUnique({
            where: {
              id: aboutId,
            },
            select: {
              image: true,
            },
          });

          if (exitingAbout && exitingAbout.image) {
            const oldImagePath = path.join("public", exitingAbout.image);
            await fs.unlink(oldImagePath);
          }

          imagePath = `/about/${req.file.filename}`;
        }

        const updatedData = {};
        if (title) updatedData.title = title;
        if (content) updatedData.content = content;
        if (imagePath) updatedData.image = imagePath;

        const updatedAbout = await prisma.about.update({
          where: { id: aboutId },
          data: updatedData,
        });

        return res.status(200).json(updatedAbout);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (error) {
    console.error("Error in upload middleware:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
