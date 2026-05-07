import { useState, useEffect } from "react";
import type { Carrusel } from "../../domain/entities/Carrusel";
import  {CarruselApi}  from "../../infraestructure/api/CarruselApi";
import { getCarrusel } from "../../domain/uses-case/GetCarrusel";

export const useCarrusel = () => {
    const [carrusel, setCarrusel] = useState<Carrusel[]>([]);
    const api = new CarruselApi();  

    useEffect(() => {
        const fetchCarrusel = async () => {
            try {
                const carruselData = await getCarrusel(api);
                setCarrusel(carruselData);
            } catch (error) {
                console.error("Error fetching carrusel in useCarrusel hook:", error);
            }
        };

        fetchCarrusel();
    }, [] );

    return carrusel;
}




