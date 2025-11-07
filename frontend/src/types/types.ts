export type LicenseType = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Driver {
  id: number;
  name: string;
  license_type: LicenseType;
}

export interface Truck {
  id: number;
  plate: string;
  model: string;
  year: number;
  minimum_license_type: LicenseType;
}

export interface Assignment {
  id: number;
  driver: number;
  truck: number;
  date: string;
}

export type Paginated<T> =
  | {
      count: number;
      next: string | null;
      previous: string | null;
      results: T[];
    }
  | T[];
