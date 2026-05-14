import type { Menu } from "../../domain/entities/menu";
import type { MenuRepository } from "../../domain/repositories/menuRepository";

const baseUrl = "http://localhost:8000";
export class MenuApi implements MenuRepository {
    async getMenu(): Promise<Menu[]> {
        try {
            const response = await fetch(`${baseUrl}/menu`);
            const json = await response.json();
            return json.data;
        } catch (error) {
            console.error("Error fetching menu:", error);
            throw error;
        }
    }
}