export const user_role = {
  customer: 'customer',
  admin: 'admin',
} as const;

export type TUserRole = keyof typeof user_role;

export interface IUser {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: 'admin' | 'customer';
}


