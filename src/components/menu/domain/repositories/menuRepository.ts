import type { Menu } from "../entities/menu";

export interface MenuRepository {
    getMenu(): Promise<Menu[]>;
}