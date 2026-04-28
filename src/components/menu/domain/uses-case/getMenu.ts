import type { Menu } from "../entities/menu";
import type { MenuRepository } from "../repositories/menuRepository";

export const getMenu = async (menuRepository: MenuRepository): Promise<Menu[]> => {
    try {
        const menu = await menuRepository.getMenu();        
        return menu;
    } catch (error) {
        console.error("Error in getMenu use case:", error);
        throw error;
    }
}