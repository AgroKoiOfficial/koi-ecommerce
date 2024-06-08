import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let where = {};
      if (search) {
        where = {
          OR: [
            {
              user: {
                name: {
                  contains: search
                }
              }
            },
            {
              product: {
                name: {
                  contains: search
                }
              }
            }
          ]
        };
      }

      const totalCarts = await prisma.cart.count({ where });
      const carts = await prisma.cart.findMany({
        where,
        select: {
          id: true,
          total: true,
          quantity: true,
          user: {
            select: {
              name: true,
            },
          },
          product: {
            select: {
              name: true,
              image: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        skip: offset,
        take: parseInt(limit),
      });

      const cartsWithUrl = carts.map((cart) => {
        return {
          ...cart,
          product: {
            ...cart.product,
            image: cart.product.image ? `${cart.product.image}` : null,
          },
        };
      });

      res.setHeader("X-Total-Count", totalCarts);
      res.status(200).json(cartsWithUrl);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch carts" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
