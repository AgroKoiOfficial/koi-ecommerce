import { prisma } from '@/prisma/prisma';
import multer from 'multer';
import { getToken } from 'next-auth/jwt';
import nextConnect from 'next-connect';

// Mengonfigurasi Multer untuk unggahan file
const upload = multer({ dest: 'public/carousels/' });

// Membuat middleware handler menggunakan next-connect
const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Maaf, terjadi kesalahan! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: 'Metode Tidak Diizinkan' });
  },
});

// Menonaktifkan parser body default
export const config = {
  api: {
    bodyParser: false,
  },
};

// Menggunakan middleware Multer untuk menangani unggahan file
apiRoute.use(upload.single('image'));

apiRoute.post(async (req, res) => {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return res.status(401).json({ message: 'Tidak Diizinkan' });
    }

    if (token.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Tidak Diizinkan' });
    }

    const { filename } = req.file;
    const { title, color } = req.body;

    const newCarousel = await prisma.carousel.create({
      data: { image: `/carousels/${filename}`, title, color },
    });

    res.status(200).json(newCarousel);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Kesalahan Server Internal' });
  }
});


export default apiRoute;
