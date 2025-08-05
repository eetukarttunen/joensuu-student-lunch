import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export type RestaurantKey = | 'Aura' | 'Carelia' | 'Futura' | 'WickedRabbit' | 'Natura' | 'Bistro' | 'Wire' | 'Solina';

export type RestaurantLinks = Record<RestaurantKey, string>;

export const restaurantLinks: RestaurantLinks = {
  Aura: process.env.Aura!,
  Carelia: process.env.Carelia!,
  Futura: process.env.Futura!,
  WickedRabbit: process.env.WickedRabbit!,
  Natura: process.env.Natura!,
  Bistro: process.env.Bistro!,
  Wire: process.env.Wire!,
  Solina: process.env.Solina!,
};

export interface SetMenu {
  SortOrder: number;
  Name: string;
  Price: string;
  Components: string[];
}

export interface MenusForDay {
  Date: string;
  LunchTime: string | null;
  SetMenus: SetMenu[];
}

export interface RestaurantData {
  RestaurantName: string;
  RestaurantUrl: string;
  PriceHeader?: string;
  Footer: string;
  MenusForDays: MenusForDay[];
  ErrorText?: string;
}

export interface RestaurantResponseSuccess {
  name: string;
  data: RestaurantData;
  category: string;
}

export interface RestaurantResponseError {
  name: string;
  error: string;
}

export type RestaurantResponse = RestaurantResponseSuccess | RestaurantResponseError;

export function hasMenusForDay(day: MenusForDay): boolean {
  return day.SetMenus.length > 0;
}

export function filterDaysWithMenus(days: MenusForDay[]): MenusForDay[] {
  return days.filter(hasMenusForDay);
}

// mandatory categorization of restaurants, because JSON doesn't provide this information
const restaurantCategories: Record<RestaurantKey, string> = {
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
export async function getData(): Promise<RestaurantResponse[]> {
  const promises = Object.entries(restaurantLinks).map(async ([name, link]) => {
    const restaurantName = name as RestaurantKey;

    try {
      const response = await axios.get<RestaurantData>(link);
      const category = restaurantCategories[restaurantName] ?? 'Unknown';

      return { name: restaurantName, data: response.data, category };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { name: restaurantName, error: error.message };
      }
      return { name: restaurantName, error: 'Unknown error' };
    }
  });

  return Promise.all(promises);
}
