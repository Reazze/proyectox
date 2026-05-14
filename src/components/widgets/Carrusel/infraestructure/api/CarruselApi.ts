import type { Carrusel } from "../../domain/entities/Carrusel";
import type { CarruselRepositorio } from "../../domain/repositories/CarruselRepositorio";

const baseUrl = "http://localhost:8000";
export class CarruselApi implements CarruselRepositorio {
    async getCarrusel(): Promise<Carrusel[]> {
        try {
            const response = await fetch(`${baseUrl}/carrusel`);
            const json = await response.json();
            return json.data;
        } catch (error) {
            console.error("Error fetching carrusel:", error);
            throw error;
        }
    }   
}