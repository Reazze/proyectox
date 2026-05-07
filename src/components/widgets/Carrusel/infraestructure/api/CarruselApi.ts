import type { Carrusel } from "../../domain/entities/Carrusel";
import type { CarruselRepositorio } from "../../domain/repositories/CarruselRepositorio";

const baseUrl = "http://localhost:8000";
export class CarruselApi implements CarruselRepositorio {
    async getCarrusel(): Promise<Carrusel[]> {
        try{
            const response = await fetch(`${baseUrl}/carrusel`)
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching carrusel:", error);
            throw error;
        }
    }   
}