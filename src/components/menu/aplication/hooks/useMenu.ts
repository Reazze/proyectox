import { useState, useEffect } from "react";
import type { Menu } from "../../domain/entities/menu";
import { MenuApi } from "../../infraestructure/api/menuApi";
import { getMenu } from "../../domain/uses-case/getMenu";


export const useMenu = () => {
    const [menu, setMenu] = useState<Menu[]>([]);
    const api = new MenuApi();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const menuData = await getMenu(api);
                setMenu(menuData);
            } catch (error) {
                console.error("Error fetching menu in useMenu hook:", error);
            }
        };

        fetchMenu();
    },[] );

    return menu;
}   
