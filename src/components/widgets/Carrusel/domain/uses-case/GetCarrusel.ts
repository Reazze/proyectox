import type { Carrusel } from "../entities/Carrusel";
import type { CarruselRepositorio } from "../repositories/CarruselRepositorio";

export const getCarrusel = async (carruselRepositorio: CarruselRepositorio): Promise<Carrusel[]> => {
    try {
        const carrusel = await carruselRepositorio.getCarrusel();
        return carrusel;
    } catch (error) {
        console.error("Error in getCarrusel use case:", error);
        throw error;
    }   
}