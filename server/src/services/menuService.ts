import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export type RestaurantKey =
  | 'Aura'
  | 'Carelia'
  | 'Futura'
  | 'WickedRabbit'
  | 'Natura'
  | 'Bistro'
  | 'Wire'
  | 'Solina';

export type RestaurantLinks = Record<RestaurantKey, string>;

/**
 * Throws an error if the env variable is not defined
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const restaurantLinks: RestaurantLinks = {
  Aura: requireEnv('Aura'),
  Carelia: requireEnv('Carelia'),
  Futura: requireEnv('Futura'),
  WickedRabbit: requireEnv('WickedRabbit'),
  Natura: requireEnv('Natura'),
  Bistro: requireEnv('Bistro'),
  Wire: requireEnv('Wire'),
  Solina: requireEnv('Solina'),
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

// mandatory categorization of restaurants
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

// main function for fetching menu data from all restaurants.
 
export async function getData(): Promise<RestaurantResponse[]> {
  const promises = Object.entries(restaurantLinks).map(async ([name, link]) => {
    const restaurantName = name as RestaurantKey;

    try {
      const response = await axios.get<RestaurantData>(link);
      const category = restaurantCategories[restaurantName] ?? 'Unknown';

      return {
        name: restaurantName,
        data: response.data,
        category,
      };
    } catch (error: unknown) {
      console.error(`Failed to fetch data for ${restaurantName}:`, error);
      return {
        name: restaurantName,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  return Promise.all(promises);
}
