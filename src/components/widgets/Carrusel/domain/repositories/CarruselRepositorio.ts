import type { Carrusel } from "../entities/Carrusel";

export interface CarruselRepositorio {
    getCarrusel(): Promise<Carrusel[]>;
}