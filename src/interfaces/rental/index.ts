import { UserInterface } from 'interfaces/user';
import { CarInterface } from 'interfaces/car';
import { GetQueryInterface } from 'interfaces';

export interface RentalInterface {
  id?: string;
  start_date: any;
  end_date: any;
  total_cost: number;
  user_id: string;
  car_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  car?: CarInterface;
  _count?: {};
}

export interface RentalGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  car_id?: string;
}
