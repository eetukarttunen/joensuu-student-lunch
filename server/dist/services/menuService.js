import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();
export const restaurantLinks = {
    Aura: process.env.Aura,
    Carelia: process.env.Carelia,
    Futura: process.env.Futura,
    WickedRabbit: process.env.WickedRabbit,
    Natura: process.env.Natura,
    Bistro: process.env.Bistro,
    Wire: process.env.Wire,
    Solina: process.env.Solina,
};
export function hasMenusForDay(day) {
    return day.SetMenus.length > 0;
}
export function filterDaysWithMenus(days) {
    return days.filter(hasMenusForDay);
}
// mandatory categorization of restaurants, because JSON doesn't provide this information
const restaurantCategories = {
    Aura: 'UEF',
    Carelia: 'UEF',
    Futura: 'UEF',
    WickedRabbit: 'UEF',
    Natura: 'UEF',
    Bistro: 'UEF',
    Wire: 'Karelia',
    Solina: 'Karelia',
};
// main get data function for fetching restaurant data
export async function getData() {
    const promises = Object.entries(restaurantLinks).map(async ([name, link]) => {
        const restaurantName = name;
        try {
            const response = await axios.get(link);
            const category = restaurantCategories[restaurantName] ?? 'Unknown';
            return { name: restaurantName, data: response.data, category };
        }
        catch (error) {
            if (error instanceof Error) {
                return { name: restaurantName, error: error.message };
            }
            return { name: restaurantName, error: 'Unknown error' };
        }
    });
    return Promise.all(promises);
}
//# sourceMappingURL=menuService.js.map