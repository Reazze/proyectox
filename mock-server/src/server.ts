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
  ventas: number;
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
      { id: 4, nombre: "smartphones" },
      { id: 5, nombre: "tablets" },
      { id: 6, nombre: "accesorios" },
      { id: 7, nombre: "audio" },
      { id: 8, nombre: "wearables" },
    ],
  },
  {
    id: 9,
    nombre: "ropa",
    children: [
      { id: 10, nombre: "camisetas" },
      { id: 11, nombre: "pantalones" },
      { id: 12, nombre: "chaquetas" },
      { id: 13, nombre: "calzado" },
    ],
  },
  {
    id: 14,
    nombre: "hogar",
    children: [
      { id: 15, nombre: "cocina" },
      { id: 16, nombre: "dormitorio" },
      { id: 17, nombre: "decoración" },
    ],
  },
  {
    id: 18,
    nombre: "deporte",
    children: [
      { id: 19, nombre: "bicicletas" },
      { id: 20, nombre: "fitness" },
    ],
  },
];

const products: Product[] = [
  {
    id: 1,
    nombre: "Laptop Gamer XYZ Pro",
    image: "/src/assets/hero_fondo.png",
    descripcion:
      "Potente laptop gamer con Intel i7, 16GB RAM, RTX 3060 y pantalla 144Hz. Ideal para gaming y trabajo profesional.",
    precio: 1200,
    precio_oferta: 999,
    categorias: ["laptops", "gaming", "tecnología"],
    sku: "LAP-GAMER-XYZ",
    stock: 10,
    ventas: 235,
  },
  {
    id: 2,
    nombre: "Mouse RGB Gaming Pro",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Mouse gamer RGB con sensor óptico de 16000 DPI, switches Omron y iluminación RGB personalizable.",
    precio: 80,
    precio_oferta: 59,
    categorias: ["gaming", "accesorios", "tecnología"],
    sku: "MOUSE-RGB",
    stock: 20,
    ventas: 178,
  },
  {
    id: 3,
    nombre: "Teclado Mecánico RGB",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Teclado mecánico con switches Cherry MX Red, iluminación RGB por tecla y reposamuñecas ergonómico.",
    precio: 150,
    precio_oferta: 120,
    categorias: ["gaming", "accesorios", "tecnología"],
    sku: "KB-MECH-RGB",
    stock: 15,
    ventas: 142,
  },
  {
    id: 4,
    nombre: "Monitor 27\" 144Hz Gaming",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Monitor gaming de 27 pulgadas con resolución 1440p, 144Hz, 1ms de respuesta y tecnología G-Sync.",
    precio: 400,
    precio_oferta: 349,
    categorias: ["monitores", "gaming", "tecnología"],
    sku: "MON-27-144HZ",
    stock: 8,
    ventas: 89,
  },
  {
    id: 5,
    nombre: "Auriculares Inalámbricos Sony",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Auriculares inalámbricos con cancelación de ruido activa, batería de 30 horas y sonido de alta calidad.",
    precio: 250,
    precio_oferta: 199,
    categorias: ["audio", "tecnología", "accesorios"],
    sku: "HEAD-SONY-WL",
    stock: 25,
    ventas: 156,
  },
  {
    id: 6,
    nombre: "Smartphone Samsung Galaxy S23",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Smartphone de última generación con cámara de 50MP, procesador Snapdragon 8 Gen 2 y pantalla AMOLED 120Hz.",
    precio: 900,
    precio_oferta: 799,
    categorias: ["smartphones", "tecnología", "móviles"],
    sku: "PHONE-S23",
    stock: 12,
    ventas: 203,
  },
  {
    id: 7,
    nombre: "Tablet iPad Air 5ta Gen",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Tablet Apple con chip M1, pantalla Liquid Retina de 10.9\" y compatibilidad con Apple Pencil.",
    precio: 600,
    precio_oferta: 549,
    categorias: ["tablets", "tecnología", "apple"],
    sku: "TAB-IPAD-AIR",
    stock: 18,
    ventas: 127,
  },
  {
    id: 8,
    nombre: "Smartwatch Garmin Fenix 7",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Reloj inteligente multideporte con GPS, monitor de frecuencia cardíaca y batería de hasta 18 días.",
    precio: 700,
    precio_oferta: 599,
    categorias: ["wearables", "deporte", "tecnología"],
    sku: "WATCH-GARMIN",
    stock: 6,
    ventas: 94,
  },
  {
    id: 9,
    nombre: "Cámara DSLR Canon EOS R",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Cámara mirrorless full-frame con sensor de 30.3MP, video 4K y sistema de enfoque Dual Pixel CMOS AF.",
    precio: 1800,
    precio_oferta: 1599,
    categorias: ["cámaras", "fotografía", "tecnología"],
    sku: "CAM-CANON-R",
    stock: 4,
    ventas: 67,
  },
  {
    id: 10,
    nombre: "Consola PlayStation 5",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Consola de nueva generación con SSD ultra-rápido, gráficos 4K y compatibilidad con retrocompatibilidad.",
    precio: 500,
    precio_oferta: 449,
    categorias: ["gaming", "consolas", "tecnología"],
    sku: "PS5-STANDARD",
    stock: 3,
    ventas: 312,
  },
  {
    id: 11,
    nombre: "Zapatillas Nike Air Max",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Zapatillas deportivas con amortiguación Air Max, diseño moderno y materiales transpirables.",
    precio: 120,
    precio_oferta: 99,
    categorias: ["ropa", "deporte", "calzado"],
    sku: "SHOES-NIKE-AIR",
    stock: 30,
    ventas: 89,
  },
  {
    id: 12,
    nombre: "Camiseta Adidas Originals",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Camiseta clásica de algodón orgánico con logo Adidas, disponible en varios colores.",
    precio: 35,
    precio_oferta: 25,
    categorias: ["ropa", "camisetas", "deporte"],
    sku: "TSHIRT-ADIDAS",
    stock: 45,
    ventas: 134,
  },
  {
    id: 13,
    nombre: "Jeans Levi's 501",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Jeans clásicos de corte recto, confeccionados en denim de alta calidad con el icónico logo Levi's.",
    precio: 80,
    precio_oferta: 65,
    categorias: ["ropa", "pantalones", "jeans"],
    sku: "JEANS-LEVIS-501",
    stock: 22,
    ventas: 76,
  },
  {
    id: 14,
    nombre: "Chaqueta Bomber Cuero",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Chaqueta bomber de cuero genuino con forro interior, diseño vintage y cierre frontal.",
    precio: 200,
    precio_oferta: 159,
    categorias: ["ropa", "chaquetas", "cuero"],
    sku: "JACKET-BOMBER",
    stock: 8,
    ventas: 43,
  },
  {
    id: 15,
    nombre: "Bolso Tote Canvas",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Bolso tote de lona resistente con asas largas, perfecto para uso diario o como bolso de playa.",
    precio: 45,
    precio_oferta: 35,
    categorias: ["accesorios", "bolsos", "moda"],
    sku: "BAG-TOTE-CANVAS",
    stock: 28,
    ventas: 67,
  },
  {
    id: 16,
    nombre: "Cafetera Espresso Manual",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Cafetera italiana manual de aluminio con mango de baquelita, capacidad para 6 tazas.",
    precio: 85,
    precio_oferta: 69,
    categorias: ["hogar", "cocina", "café"],
    sku: "COFFEE-MACHINE",
    stock: 16,
    ventas: 98,
  },
  {
    id: 17,
    nombre: "Juego de Sábanas Algodón",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Juego de sábanas de algodón egipcio 400 hilos, incluye sábana bajera, encimera y fundas de almohada.",
    precio: 120,
    precio_oferta: 95,
    categorias: ["hogar", "dormitorio", "textiles"],
    sku: "SHEETS-COTTON",
    stock: 12,
    ventas: 54,
  },
  {
    id: 18,
    nombre: "Lámpara de Mesa Moderna",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Lámpara de mesa con base de mármol y pantalla de tela, proporciona iluminación cálida y ambiente.",
    precio: 150,
    precio_oferta: 119,
    categorias: ["hogar", "iluminación", "decoración"],
    sku: "LAMP-TABLE",
    stock: 9,
    ventas: 32,
  },
  {
    id: 19,
    nombre: "Set de Utensilios Cocina",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Set completo de utensilios de cocina de acero inoxidable, incluye 12 piezas esenciales.",
    precio: 65,
    precio_oferta: 49,
    categorias: ["hogar", "cocina", "utensilios"],
    sku: "KITCHEN-TOOLS",
    stock: 20,
    ventas: 87,
  },
  {
    id: 20,
    nombre: "Bicicleta Montaña Trek",
    image: "/src/assets/hero_fondo.png",
    descripcion: "Bicicleta de montaña con cuadro de aluminio, 21 velocidades y frenos de disco hidráulicos.",
    precio: 800,
    precio_oferta: 699,
    categorias: ["deporte", "bicicletas", "outdoor"],
    sku: "BIKE-TREK-MTB",
    stock: 5,
    ventas: 28,
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
      {
        productId:2,
        quantity: 1,
      }
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
  const page = Number(_req.query.page ?? 1);
  const limit = Number(_req.query.limit ?? 25);
  const categoria = String(_req.query.categoria ?? "").toLowerCase();
  const search = String(_req.query.search ?? "").toLowerCase();

  let filtered = products;

  if (categoria) {
    filtered = filtered.filter((product) =>
      product.categorias.some((cat) => cat.toLowerCase() === categoria)
    );
  }

  if (search) {
    filtered = filtered.filter((product) =>
      product.nombre.toLowerCase().includes(search) ||
      product.descripcion.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search)
    );
  }

  const total = filtered.length;
  const normalizedPage = Math.max(1, page);
  const normalizedLimit = Math.max(1, Math.min(limit, 100));
  const totalPages = Math.max(1, Math.ceil(total / normalizedLimit));
  const offset = (normalizedPage - 1) * normalizedLimit;
  const paginated = filtered.slice(offset, offset + normalizedLimit);

  res.json({
    success: true,
    total,
    page: normalizedPage,
    limit: normalizedLimit,
    totalPages,
    data: paginated,
  });
});

app.get("/productos/mas-vendidos", (_req: Request, res: Response) => {
  const limit = Number(_req.query.limit ?? 4);
  const topProducts = [...products]
    .sort((a, b) => b.ventas - a.ventas)
    .slice(0, Math.max(1, Math.min(limit, 12)));

  res.json({
    success: true,
    total: topProducts.length,
    data: topProducts,
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

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "No hay suficiente stock disponible.",
      });
    }

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
      });
    }

    product.stock -= quantity;

    const detailedItems = cart.items.map((item) => {
      const productDetail = getProductById(item.productId);
      return {
        product: productDetail,
        quantity: item.quantity,
      };
    });

    res.json({
      success: true,
      data: detailedItems,
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

    const product = getProductById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    const delta = quantity - item.quantity;

    if (delta > 0 && delta > product.stock) {
      return res.status(400).json({
        success: false,
        message: "No hay suficiente stock disponible para aumentar la cantidad.",
      });
    }

    item.quantity = quantity;
    product.stock -= delta;

    const detailedItems = cart.items.map((item) => {
      const productDetail = getProductById(item.productId);
      return {
        product: productDetail,
        quantity: item.quantity,
      };
    });

    res.json({
      success: true,
      data: detailedItems,
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

    const item = cart.items.find((item) => item.productId === productId);
    if (item) {
      const product = getProductById(productId);
      if (product) {
        product.stock += item.quantity;
      }
    }

    cart.items = cart.items.filter(
      (item) => item.productId !== productId
    );

    const detailedItems = cart.items.map((item) => {
      const productDetail = getProductById(item.productId);
      return {
        product: productDetail,
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
      data: [],
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
    id: 3,
    name: "Productos",
    path: "/productos",
  },
  {
    id: 2,
    name: "Contacto",
    path:"/contacto"
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