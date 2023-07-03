import { RentalInterface } from 'interfaces/rental';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface CarInterface {
  id?: string;
  name: string;
  daily_rental_price: number;
  company_id: string;
  created_at?: any;
  updated_at?: any;
  rental?: RentalInterface[];
  company?: CompanyInterface;
  _count?: {
    rental?: number;
  };
}

export interface CarGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  company_id?: string;
}
