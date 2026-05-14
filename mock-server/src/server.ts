import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

/* ======================================================
   TYPES
====================================================== */

type User = {
  id: number;
  email: string;
  name: string;
  foto_perfil: string;
  password: string;
  role: string;
};

type AuthRequest = Request & {
  user?: User;
};

type Product = {
  id: number;
  nombre: string;
  image: string;
  descripcion: string;
  precio: number;
  precio_oferta: number;
  categorias: string[];
  sku: string;
  stock: number;
};

type CartItem = {
  productId: number;
  quantity: number;
};

type Cart = {
  userId: number;
  items: CartItem[];
};

/* ======================================================
   MOCK DATABASE
====================================================== */

const categories = [
  {
    id: 1,
    nombre: "tecnología",
    children: [
      { id: 2, nombre: "laptops" },
      { id: 3, nombre: "gaming" },
    ],
  },
];

const products: Product[] = [
  {
    id: 1,
    nombre: "Laptop Gamer XYZ",
    image: "/src/assets/hero_fondo.png",
    descripcion:
      "Potente laptop gamer con Intel i7, 16GB RAM y RTX 3060.",
    precio: 1200,
    precio_oferta: 999,
    categorias: ["laptops", "gaming"],
    sku: "LAP-GAMER-XYZ",
    stock: 10,
  },
  {
    id: 2,
    nombre: "Mouse RGB",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Mouse gamer RGB con sensor óptico.",
    precio: 80,
    precio_oferta: 59,
    categorias: ["gaming"],
    sku: "MOUSE-RGB",
    stock: 20,
  },
];

const users: User[] = [
  {
    id: 1,
    email: "admin@test.com",
    name: "Jose",
    foto_perfil: "/src/assets/hero_fondo.png",
    password: "123456",
    role: "admin",
  },
  {
    id: 2,
    email: "user@test.com",
    name: "Manuel",
    foto_perfil: "/src/assets/hero_fondo.png",
    password: "123456",
    role: "cliente",
  },
];

const carts: Cart[] = [
  {
    userId: 2,
    items: [
      {
        productId: 1,
        quantity: 2,
      },
    ],
  },
];

const sessions: {
  token: string;
  userId: number;
}[] = [];

/* ======================================================
   UTILIDADES
====================================================== */

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const randomError = () => Math.random() < 0.05;

const generateToken = () =>
  `fake-jwt-${Date.now()}-${Math.random()}`;

const getUserCart = (userId: number) => {
  return carts.find((cart) => cart.userId === userId);
};

const getProductById = (id: number) => {
  return products.find((product) => product.id === id);
};

/* ======================================================
   AUTH MIDDLEWARE
====================================================== */

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No autorizado",
    });
  }

  const token = authHeader.replace("Bearer ", "");

  const session = sessions.find((s) => s.token === token);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Token inválido",
    });
  }

  const user = users.find((u) => u.id === session.userId);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  req.user = user;

  next();
};

/* ======================================================
   PRODUCTS
====================================================== */

app.get("/productos", (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: products.length,
    data: products,
  });
});

app.get("/productos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const product = getProductById(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Producto no encontrado",
    });
  }

  res.json({
    success: true,
    data: product,
  });
});

app.get(
  "/productos/categoria/:categoria",
  (
    req: Request<{ categoria: string }>,
    res: Response
  ) => {

    const categoria = req.params.categoria;

    const filteredProducts = products.filter((product) =>
      product.categorias.includes(categoria)
    );

    res.json({
      success: true,
      total: filteredProducts.length,
      data: filteredProducts,
    });
  }
);

/* ======================================================
   CATEGORIES
====================================================== */

app.get("/categorias", (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: categories.length,
    data: categories,
  });
});

/* ======================================================
   AUTH
====================================================== */

app.post("/auth/login", async (req: Request, res: Response) => {
  await delay(500);

  if (randomError()) {
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }

  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Credenciales inválidas",
    });
  }

  const token = generateToken();

  sessions.push({
    token,
    userId: user.id,
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      foto_perfil: user.foto_perfil,
      name: user.name,
    },
  });
});

app.post("/auth/register", async (req: Request, res: Response) => {
  await delay(500);

  const { email, password, role, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email y password son obligatorios",
    });
  }

  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "El usuario ya existe",
    });
  }

  const newUser: User = {
    id: users.length + 1,
    email,
    name: name || "sin nombre",
    foto_perfil: "/src/assets/hero_fondo.png",
    password,
    role: role || "cliente",
  };

  users.push(newUser);

  const token = generateToken();

  sessions.push({
    token,
    userId: newUser.id,
  });

  res.status(201).json({
    success: true,
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      foto_perfil: newUser.foto_perfil,
    },
  });
});

app.post(
  "/auth/logout",
  authMiddleware,
  (req: AuthRequest, res: Response) => {
    const authHeader = req.headers.authorization!;
    const token = authHeader.replace("Bearer ", "");
    const sessionIndex = sessions.findIndex((s) => s.token === token);

    if (sessionIndex !== -1) {
      sessions.splice(sessionIndex, 1);
    }

    res.json({
      success: true,
      message: "Cierre de sesión exitoso",
    });
  }
);

app.get(
  "/auth/me",
  authMiddleware,
  (req: AuthRequest, res: Response) => {
    res.json({
      success: true,
      data: req.user,
    });
  }
);

/* ======================================================
   CART
====================================================== */

app.get(
  "/cart",
  authMiddleware,
  (req: AuthRequest, res: Response) => {
    const cart = getUserCart(req.user!.id);

    if (!cart) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const detailedItems = cart.items.map((item) => {
      const product = getProductById(item.productId);

      return {
        product,
        quantity: item.quantity,
      };
    });

    res.json({
      success: true,
      data: detailedItems,
    });
  }
);

app.post(
  "/cart/items",
  authMiddleware,
  (req: AuthRequest, res: Response) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "productId y quantity son obligatorios",
      });
    }

    const product = getProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    let cart = getUserCart(req.user!.id);

    if (!cart) {
      cart = {
        userId: req.user!.id,
        items: [],
      };

      carts.push(cart);
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
      });
    }

    res.json({
      success: true,
      data: cart,
    });
  }
);

app.put(
  "/cart/items/:productId",
  authMiddleware,
  (req: AuthRequest, res: Response) => {
    const productId = Number(req.params.productId);
    const { quantity } = req.body;

    const cart = getUserCart(req.user!.id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Carrito no encontrado",
      });
    }

    const item = cart.items.find(
      (item) => item.productId === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado en carrito",
      });
    }

    item.quantity = quantity;

    res.json({
      success: true,
      data: cart,
    });
  }
);

app.delete(
  "/cart/items/:productId",
  authMiddleware,
  (req: AuthRequest, res: Response) => {
    const productId = Number(req.params.productId);

    const cart = getUserCart(req.user!.id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Carrito no encontrado",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId !== productId
    );

    res.json({
      success: true,
      data: cart,
    });
  }
);

app.post(
  "/cart/clear",
  authMiddleware,
  (req: AuthRequest, res: Response) => {
    const cart = getUserCart(req.user!.id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Carrito no encontrado",
      });
    }

    cart.items = [];

    res.json({
      success: true,
      message: "Carrito limpiado correctamente",
    });
  }
);

/* ======================================================
   MENU
====================================================== */

const menu = [
  {
    id: 1,
    icon: "bi bi-house-fill",
    name: "Inicio",
    path: "/",
  },
  {
    id: 2,
    //icon: "bi bi-telephone-fill",
    name: "Contacto",
    path: "/contacto",
  }
];

const carrusel = [
  {
    id: 1,
    image: "/src/assets/hero_fondo.png",
    title: "Bienvenido",
    description: "Nuestra tienda virtual",
  },
  {
    id: 2,
    image: "/src/assets/hero_fondo.png",
    title: "Productos",
    description: "Explora nuestra variedad de productos",
    path: "/productos",
  },
  {
    id: 3,
    image: "/src/assets/hero_fondo.png",
    title: "Nosotros",
    description: "Conoce más sobre nosotros",
    path: "/nosotros",
  }
];

app.get("/menu", (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: menu,
  });
});

app.get("/carrusel", (_req: Request, res:Response) => {
  res.json({
    success: true,
    data: carrusel,
  });
});

/* ======================================================
   SERVER
====================================================== */

app.listen(PORT, () => {
  console.log(
    `🚀 Server corriendo en http://localhost:${PORT}`
  );
});