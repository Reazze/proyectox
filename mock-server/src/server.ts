import express from "express";
import type { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const productos = [
  { id: 1, nombre: "Laptop", precio: 2500 , categoria : "electronico"},
  { id: 2, nombre: "Mouse", precio: 50 , categoria : "periferico" },
  { id: 3, nombre: "Teclado", precio: 100 , categoria : "periferico" },
  { id: 4, nombre: "Monitor", precio: 800 , categoria : "electronico" },
  { id: 5, nombre: "Software Antivirus", precio: 200 , categoria : "software" },
  { id: 6, nombre: "Impresora", precio: 400 , categoria : "electronico" },
  { id: 7, nombre: "Auriculares", precio: 150 , categoria : "periferico" },
  { id: 8, nombre: "Silla Gamer", precio: 1200 , categoria : "otros" },
  { id: 9, nombre: "Escritorio", precio: 800 , categoria : "otros" },
  { id: 10, nombre: "Webcam", precio: 300 , categoria : "periferico" }, 
];

app.get("/productos", (req: Request, res: Response) => {
  res.json(productos);
});

app.get("/productos/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const producto = productos.find(p => p.id === id);
  if (producto) {
    res.json(producto);
  } else { 
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

app.get("/productos/categoria/:categoria", (req: Request, res: Response) => {
  const categoria = req.params.categoria;
  const productosFiltrados = productos.filter(p => p.categoria === categoria);
  res.json(productosFiltrados);
});


/* =========================
   MOCK DATA (USERS)
========================= */

const users = [
  {
    id: 1,
    email: "admin@test.com",
    password: "123456",
    role: "admin"
  },
  {
    id: 2,
    email: "user@test.com",
    password: "123456",
    role: "cliente"
  }
];

/* =========================
   UTILIDADES
========================= */

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const randomError = () => Math.random() < 0.1;

/* =========================
   AUTH
========================= */

app.post("/auth/login", async (req, res) => {
  await delay(500); // simula backend lento

  if (randomError()) {
    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }

  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Credenciales inválidas"
    });
  }

  const userRole = user.role || 'cliente';

  // token fake
  const token = `fake-jwt-${Date.now()}`;

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: userRole
    }
  });
});

app.post("/auth/register", async (req, res) => {
  await delay(500);

  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "El email y la contraseña son obligatorios"
    });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      message: "El usuario ya existe"
    });
  }

  const newUser = {
    id: users.length + 1,
    email,
    password,
    role: role?.trim() ? role.trim() : 'cliente'
  };

  users.push(newUser);

  const token = `fake-jwt-${Date.now()}`;

  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    }
  });
});

app.get("/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No autorizado" });
  }

  return res.json({
    id: 1,
    email: "admin@test.com",
    role: "admin"
  });
});


const menu = [
  {id:1, icon: "bi bi-house-fill", name: "Inicio", path: "/" },
  { id: 2, icon: "bi-people-fill", name: "Nosotros", 
    children: [
      { id: 3, icon: "bi-clock-fill", name: "Historia", path: "/historia" },
      { id: 4, icon: "bi-person-fill", name: "Equipo", path: "/equipo" },
      { id: 7, icon: "bi-bullseye", name: "Misión y Visión", path: "/mision-vision" },
    ]
   },
   { id: 5, icon: "bi-gear-fill", name: "Servicios", path: "/servicios" },
   { id: 6, icon: "bi-envelope-fill", name: "Contacto", path: "/contacto" },

];

app.get("/menu", (req, res) => {
  res.json(menu);
});


app.listen(PORT, () => {
  console.log(`🚀 Server corriendo en http://localhost:${PORT}`);
});